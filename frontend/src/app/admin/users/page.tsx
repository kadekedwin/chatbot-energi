'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users as UsersIcon, UserPlus, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';

export default function UsersPage() {
  const users = [
    {
      id: '1',
      name: 'Admin EnerNova',
      email: 'admin@enernova.id',
      role: 'admin',
      joinDate: '2024-01-10',
      journalsUploaded: 12
    },
    {
      id: '2',
      name: 'Researcher Demo',
      email: 'user@enernova.id',
      role: 'user',
      joinDate: '2024-03-15',
      journalsUploaded: 5
    },
    {
      id: '3',
      name: 'Dr. Budi Santoso',
      email: 'budi.santoso@enernova.id',
      role: 'user',
      joinDate: '2024-05-20',
      journalsUploaded: 8
    },
    {
      id: '4',
      name: 'Prof. Siti Aminah',
      email: 'siti.aminah@enernova.id',
      role: 'user',
      joinDate: '2024-06-12',
      journalsUploaded: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Manajemen Pengguna
            </h1>
            <p className="text-slate-600 mt-2">
              Kelola akses dan role pengguna platform
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-emerald-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-emerald-600" />
                Total Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-teal-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-teal-600" />
                Researcher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">
                {users.filter(u => u.role === 'user').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <UsersIcon className="w-5 h-5" />
              Daftar Pengguna
            </CardTitle>
            <CardDescription>
              Kelola akses dan permission pengguna
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-6 bg-white border-2 border-emerald-100 rounded-xl hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-emerald-200">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-lg font-bold">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-slate-900">{user.name}</h3>
                        {user.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Bergabung: {new Date(user.joinDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-emerald-600 font-medium">
                          📚 {user.journalsUploaded} jurnal di-upload
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => {
                        const newRole = user.role === 'admin' ? 'user' : 'admin';
                        alert(`✏️ Edit User: ${user.name}\n\nRole diubah dari "${user.role}" menjadi "${newRole}"\n\n(Dalam sistem production, ini akan menyimpan ke database)`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus user "${user.name}"?`)) {
                          alert(`🗑️ User "${user.name}" berhasil dihapus!\n\n(Dalam sistem production, data akan dihapus dari database)`);
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
