import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Users, MoreHorizontal, Shield, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { id: 'u_1', name: 'Admin User', email: 'admin@insightpilot.com', role: 'admin', lastActive: 'Just now' },
  { id: 'u_2', name: 'John Doe', email: 'john@example.com', role: 'project_manager', lastActive: '2 hrs ago' },
  { id: 'u_3', name: 'Jane Smith', email: 'jane@example.com', role: 'viewer', lastActive: '1 day ago' },
  { id: 'u_4', name: 'Alice Cooper', email: 'alice@example.com', role: 'viewer', lastActive: '3 days ago' },
];

export default function AdminWorkspace() {
  const [users, setUsers] = useState(MOCK_USERS);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success('User role updated successfully');
  };

  const handleRevoke = (userId) => {
    if (userId === 'u_1') {
      toast.error('Cannot revoke the primary admin account.');
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User access revoked');
  };

  const handleInvite = () => {
    const email = window.prompt("Enter email address to invite:");
    if (email && email.trim()) {
      const newId = 'u_' + Math.floor(Math.random() * 10000);
      setUsers([...users, { id: newId, name: 'Pending Invite', email: email.trim(), role: 'viewer', lastActive: 'Never' }]);
      toast.success(`Invite sent to ${email}`);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Administration</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and global workspace settings.
          </p>
        </div>
        
        <Button onClick={handleInvite} className="gap-2">
          <Mail className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Total Users</div>
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Admins</div>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Pending Invites</div>
              <div className="text-2xl font-bold">{users.filter(u => u.name === 'Pending Invite').length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-muted-foreground mt-0.5">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === 'u_1'} // Prevent changing main admin
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                        user.role === 'admin' ? "bg-primary/20 text-primary" : 
                        user.role === 'project_manager' ? "bg-blue-500/20 text-blue-600" :
                        "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer"
                      )}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="project_manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRevoke(user.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
