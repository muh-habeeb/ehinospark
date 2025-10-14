'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Trash2, Plus, Edit, MessageSquare, Calendar, Clock, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface Announcement {
    _id?: string;
    text: string;
    startDate?: string;
    endDate?: string;
}

export default function AnnouncementsManagement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const emptyAnnouncement: Announcement = {
        text: '',
        startDate: '',
        endDate: ''
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/announcements');
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast.error('Failed to load announcements');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingAnnouncement || !editingAnnouncement.text.trim()) {
            toast.error('Please enter announcement text');
            return;
        }

        setIsSaving(true);
        try {
            const method = editingAnnouncement._id ? 'PUT' : 'POST';
            const url = editingAnnouncement._id ? `/api/announcements/${editingAnnouncement._id}` : '/api/announcements';

            // Convert empty strings to null for dates
            const dataToSend = {
                ...editingAnnouncement,
                startDate: editingAnnouncement.startDate || null,
                endDate: editingAnnouncement.endDate || null
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const savedAnnouncement = await response.json();

                if (editingAnnouncement._id) {
                    setAnnouncements(prev => prev.map(ann => ann._id === savedAnnouncement._id ? savedAnnouncement : ann));
                } else {
                    setAnnouncements(prev => [savedAnnouncement, ...prev]);
                }

                setIsDialogOpen(false);
                setEditingAnnouncement(null);
                toast.success(editingAnnouncement._id ? 'Announcement updated successfully!' : 'Announcement created successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save announcement');
            }
        } catch (error) {
            console.error('Error saving announcement:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save announcement');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (announcementId: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            const response = await fetch(`/api/announcements/${announcementId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAnnouncements(prev => prev.filter(ann => ann._id !== announcementId));
                toast.success('Announcement deleted successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete announcement');
        }
    };

    const openDialog = (announcement?: Announcement) => {
        setEditingAnnouncement(announcement ? { ...announcement } : { ...emptyAnnouncement });
        setIsDialogOpen(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    const isActive = (announcement: Announcement) => {
        const now = new Date();
        const start = announcement.startDate ? new Date(announcement.startDate) : null;
        const end = announcement.endDate ? new Date(announcement.endDate) : null;

        if (start && start > now) return false;
        if (end && end < now) return false;
        return true;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className='size-16 animate-spin text-blue-600' />

            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-6 w-6" />
                        Announcements Management
                    </h2>
                    <p className="text-gray-400">Manage site announcements and notices</p>
                </div>
                <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {announcements.map((announcement) => (
                        <motion.div
                            key={announcement._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="group"
                        >
                            <Card className={`transition-all duration-300 bg-gray-800 border-gray-700 ${isActive(announcement) ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                                }`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive(announcement)
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {isActive(announcement) ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    {formatDate(announcement.startDate)} - {formatDate(announcement.endDate) || 'No end date'}
                                                </span>
                                            </div>

                                            <p className="text-white text-sm leading-relaxed">{announcement.text}</p>

                                            {(announcement.startDate || announcement.endDate) && (
                                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                                    {announcement.startDate && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Start: {formatDate(announcement.startDate)}</span>
                                                        </div>
                                                    )}
                                                    {announcement.endDate && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>End: {formatDate(announcement.endDate)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                onClick={() => openDialog(announcement)}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-600  hover:text-gray-200 hover:bg-gray-700"
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(announcement._id!)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
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

            {announcements.length === 0 && (
                <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No announcements yet</h3>
                    <p className="text-gray-400 mb-4">Create your first announcement to inform visitors.</p>
                    <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Announcement
                    </Button>
                </div>
            )}

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingAnnouncement?._id ? 'Edit Announcement' : 'Create New Announcement'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {editingAnnouncement?._id ? 'Update announcement details' : 'Add a new announcement for site visitors'}
                        </DialogDescription>
                    </DialogHeader>

                    {editingAnnouncement && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="text" className="text-gray-300">Announcement Text *</Label>
                                <Textarea
                                    id="text"
                                    value={editingAnnouncement.text}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingAnnouncement(prev => prev ? { ...prev, text: e.target.value } : null)}
                                    placeholder="Enter your announcement message"
                                    rows={4}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-gray-300">Start Date (Optional)</Label>
                                    <Input
                                        id="startDate"
                                        type="datetime-local"
                                        value={editingAnnouncement.startDate || ''}
                                        onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-gray-300">End Date (Optional)</Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        value={editingAnnouncement.endDate || ''}
                                        onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-700 p-3 rounded-lg">
                                <p className="text-xs text-gray-400">
                                    <strong>Note:</strong> Leave dates empty for permanent announcements.
                                    Start date controls when the announcement becomes visible,
                                    end date controls when it expires.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSaving}
                            className="border-gray-600 hover:text-gray-300 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingAnnouncement?._id ? 'Update' : 'Create'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}