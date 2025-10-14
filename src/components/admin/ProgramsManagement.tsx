'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Trash2, Plus, Edit, Calendar, MapPin, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Program {
  _id?: string;
  name: string;
  description: string;
  image: string;
  time?: string;
  location?: string;
  order?: number;
}

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyProgram: Program = {
    name: '',
    description: '',
    image: '',
    time: '',
    location: '',
    order: 0
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingProgram) return;
    
    setIsSaving(true);
    try {
      const method = editingProgram._id ? 'PUT' : 'POST';
      const url = editingProgram._id ? `/api/programs/${editingProgram._id}` : '/api/programs';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProgram),
      });

      if (response.ok) {
        const savedProgram = await response.json();
        
        if (editingProgram._id) {
          setPrograms(prev => prev.map(p => p._id === savedProgram._id ? savedProgram : p));
        } else {
          setPrograms(prev => [...prev, savedProgram]);
        }
        
        setIsDialogOpen(false);
        setEditingProgram(null);
        toast.success(editingProgram._id ? 'Program updated successfully!' : 'Program created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save program');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save program');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrograms(prev => prev.filter(p => p._id !== programId));
        toast.success('Program deleted successfully!');
      } else {
        throw new Error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  const openDialog = (program?: Program) => {
    setEditingProgram(program ? { ...program } : { ...emptyProgram });
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
          <h2 className="text-2xl font-bold text-white">Programs Management</h2>
          <p className="text-gray-400">Manage cultural programs and events</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {programs.map((program) => (
            <motion.div
              key={program._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={program.image}
                      alt={program.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-white">{program.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{program.description}</p>
                    
                    {program.time && (
                      <div className="flex items-center text-sm text-purple-400 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {program.time}
                      </div>
                    )}
                    
                    {program.location && (
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {program.location}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openDialog(program)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600 hover:text-gray-300  hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(program._id!)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProgram?._id ? 'Edit Program' : 'Create New Program'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingProgram?._id ? 'Update program details' : 'Add a new cultural program'}
            </DialogDescription>
          </DialogHeader>
          
          {editingProgram && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Program Name</Label>
                <Input
                  id="name"
                  value={editingProgram.name}
                  onChange={(e) => setEditingProgram(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter program name"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={editingProgram.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProgram(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Enter program description"
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-300">Image URL</Label>
                <Input
                  id="image"
                  value={editingProgram.image}
                  onChange={(e) => setEditingProgram(prev => prev ? { ...prev, image: e.target.value } : null)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-300">Time (Optional)</Label>
                  <Input
                    id="time"
                    value={editingProgram.time || ''}
                    onChange={(e) => setEditingProgram(prev => prev ? { ...prev, time: e.target.value } : null)}
                    placeholder="e.g., 10:00 AM - 11:00 AM"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={editingProgram.location || ''}
                    onChange={(e) => setEditingProgram(prev => prev ? { ...prev, location: e.target.value } : null)}
                    placeholder="e.g., Main Auditorium"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingProgram.order || 0}
                    onChange={(e) => setEditingProgram(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                    min="0"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {editingProgram.image && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Preview</Label>
                  <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-600">
                    <Image
                      src={editingProgram.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingProgram?._id ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}