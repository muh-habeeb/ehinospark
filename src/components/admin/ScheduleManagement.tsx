'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Trash2, Plus, Edit, Calendar, Clock, MapPin, CalendarDays, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleItem {
  _id?: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  order?: number;
}

export default function ScheduleManagement() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyItem: ScheduleItem = {
    time: '',
    title: '',
    description: '',
    location: '',
    order: 0
  };

  useEffect(() => {
    fetchScheduleItems();
  }, []);

  const fetchScheduleItems = async () => {
    try {
      const response = await fetch('/api/schedule');
      if (response.ok) {
        const data = await response.json();
        setScheduleItems(data);
      }
    } catch (error) {
      console.error('Error fetching schedule items:', error);
      toast.error('Failed to load schedule items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem.time || !editingItem.title || !editingItem.description) {
      toast.error('Please fill in required fields (time, title, and description)');
      return;
    }
    
    setIsSaving(true);
    try {
      const method = editingItem._id ? 'PUT' : 'POST';
      const url = editingItem._id ? `/api/schedule/${editingItem._id}` : '/api/schedule';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        
        if (editingItem._id) {
          setScheduleItems(prev => prev.map(item => item._id === savedItem._id ? savedItem : item));
        } else {
          setScheduleItems(prev => [...prev, savedItem]);
        }
        
        setIsDialogOpen(false);
        setEditingItem(null);
        toast.success(editingItem._id ? 'Schedule item updated successfully!' : 'Schedule item created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save schedule item');
      }
    } catch (error) {
      console.error('Error saving schedule item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save schedule item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this schedule item?')) return;

    try {
      const response = await fetch(`/api/schedule/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setScheduleItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Schedule item deleted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete schedule item');
      }
    } catch (error) {
      console.error('Error deleting schedule item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete schedule item');
    }
  };

  const openDialog = (item?: ScheduleItem) => {
    setEditingItem(item ? { ...item } : { ...emptyItem });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className='size-16 animate-spin text-blue-600'/>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            Schedule Management
          </h2>
          <p className="text-gray-400">Manage event schedule and timeline</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {scheduleItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center text-blue-400 font-mono text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {item.time}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  {item.location && (
                    <div className="flex items-center text-sm text-purple-400 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openDialog(item)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 hover:text-gray-300 hover:bg-gray-700 cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id!)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 border-gray-600 hover:text-gray-300 hover:bg-red-900 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {scheduleItems.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No schedule items yet</h3>
          <p className="text-gray-400 mb-4">Start building your event schedule by adding schedule items.</p>
          <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Schedule Item
          </Button>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem?._id ? 'Edit Schedule Item' : 'Create New Schedule Item'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingItem?._id ? 'Update schedule item details' : 'Add a new item to the event schedule'}
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-300">Time *</Label>
                  <Input
                    id="time"
                    value={editingItem.time}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, time: e.target.value } : null)}
                    placeholder="e.g., 9:00 AM - 10:00 AM"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, location: e.target.value } : null)}
                    placeholder="e.g., Main Auditorium"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingItem.order || 0}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                    min="0"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Enter event title"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Enter event description"
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
              className="border-gray-600 hover:text-gray-300 hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className='cursor-pointer'>
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem?._id ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}