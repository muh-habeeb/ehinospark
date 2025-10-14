'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Trash2, Plus, Edit, Users, UserCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  order?: number;
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyMember: TeamMember = {
    name: '',
    role: '',
    bio: '',
    image: '',
    order: 0
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingMember || !editingMember.name || !editingMember.role) {
      toast.error('Please fill in required fields (name and role)');
      return;
    }
    
    setIsSaving(true);
    try {
      const method = editingMember._id ? 'PUT' : 'POST';
      const url = editingMember._id ? `/api/team/${editingMember._id}` : '/api/team';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMember),
      });

      if (response.ok) {
        const savedMember = await response.json();
        
        if (editingMember._id) {
          setTeamMembers(prev => prev.map(m => m._id === savedMember._id ? savedMember : m));
        } else {
          setTeamMembers(prev => [...prev, savedMember]);
        }
        
        setIsDialogOpen(false);
        setEditingMember(null);
        toast.success(editingMember._id ? 'Team member updated successfully!' : 'Team member added successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save team member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTeamMembers(prev => prev.filter(m => m._id !== memberId));
        toast.success('Team member removed successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove team member');
    }
  };

  const openDialog = (member?: TeamMember) => {
    setEditingMember(member ? { ...member } : { ...emptyMember });
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
            <Users className="h-6 w-6" />
            Team Management
          </h2>
          <p className="text-gray-400">Manage organizing committee members</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {teamMembers.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 text-center bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <UserCircle className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-white">{member.name}</h3>
                  <p className="text-purple-400 font-medium mb-2 text-sm">{member.role}</p>
                  
                  {member.bio && (
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2">{member.bio}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openDialog(member)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 hover:text-gray-300 hover:bg-gray-700 cursor-pointer"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(member._id!)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 border-gray-600 hover:text-gray-300 hover:bg-red-900 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No team members yet</h3>
          <p className="text-gray-400 mb-4">Start building your organizing committee by adding team members.</p>
          <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Team Member
          </Button>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingMember?._id ? 'Edit Team Member' : 'Add New Team Member'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingMember?._id ? 'Update team member details' : 'Add a new organizing committee member'}
            </DialogDescription>
          </DialogHeader>
          
          {editingMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Name *</Label>
                  <Input
                    id="name"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter full name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">Role *</Label>
                  <Input
                    id="role"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, role: e.target.value } : null)}
                    placeholder="e.g., President, Secretary, Coordinator"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingMember.order || 0}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                    placeholder="0"
                    min="0"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-300">Profile Image URL</Label>
                <Input
                  id="image"
                  value={editingMember.image}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, image: e.target.value } : null)}
                  placeholder="https://example.com/profile.jpg"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={editingMember.bio || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingMember(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  placeholder="Brief description about the team member"
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {editingMember.image && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Preview</Label>
                  <div className="w-32 h-32 relative overflow-hidden rounded-full border border-gray-600 mx-auto">
                    <Image
                      src={editingMember.image}
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
                  {editingMember?._id ? 'Update' : 'Add Member'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}