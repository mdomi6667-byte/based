import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Twitter, Send, Edit2, Save, RefreshCw, Upload, Camera, Award, Wallet } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="p-10 text-center pt-24">Please login</div>;

  const handleEdit = () => {
    setEditForm({
        name: user.name,
        about: user.about || '',
        twitter: user.twitter || '',
        telegram: user.telegram || '',
        farcasterLink: user.farcasterLink || '',
        avatarUrl: user.avatarUrl || '',
        walletAddress: user.walletAddress || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };
  
  const randomizeAvatar = () => {
      const seed = Math.floor(Math.random() * 100000);
      const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      setEditForm({ ...editForm, avatarUrl: newAvatar });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert("File is too large. Please select an image under 2MB.");
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
                    <div className="relative z-10">
                        <div className="relative inline-block group">
                             <img 
                                src={isEditing ? (editForm.avatarUrl || user.avatarUrl) : user.avatarUrl} 
                                alt={user.name} 
                                className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-md mb-4 object-cover bg-white transition-all" 
                             />
                             {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70"
                                        title="Upload Image"
                                    >
                                        <Camera size={20} />
                                    </button>
                                </div>
                             )}
                        </div>
                        
                        {isEditing ? (
                             <div className="mb-2 px-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Display Name</label>
                                <input 
                                    className="w-full text-center text-xl font-bold text-black border-b-2 border-gray-200 focus:border-black outline-none bg-transparent pb-1"
                                    value={editForm.name}
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                />
                             </div>
                        ) : (
                             <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                        )}
                        
                        <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 mt-2">{user.role}</span>
                        
                        <div className="mt-6 flex justify-center gap-3">
                            {user.twitter && (
                                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100"><Twitter size={18}/></a>
                            )}
                             {user.telegram && (
                                <a href={`https://t.me/${user.telegram}`} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100"><Send size={18}/></a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">Profile Details</h3>
                        {!isEditing && <button onClick={handleEdit} className="text-gray-400 hover:text-black"><Edit2 size={16}/></button>}
                    </div>
                    
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile Picture</label>
                                <div className="space-y-3">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-2 w-full p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        <Upload size={16} /> Upload Image
                                    </button>

                                    <div className="flex gap-2 items-center">
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                        <span className="text-xs text-gray-400 uppercase">OR URL</span>
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                    </div>

                                    <div className="flex gap-2">
                                        <input 
                                            className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors" 
                                            placeholder="https://..."
                                            value={editForm.avatarUrl}
                                            onChange={e => setEditForm({...editForm, avatarUrl: e.target.value})}
                                        />
                                        <button 
                                            onClick={randomizeAvatar} 
                                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" 
                                            title="Randomize"
                                            type="button"
                                        >
                                            <RefreshCw size={18} className="text-gray-600"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                                <textarea 
                                    className="w-full p-3 border rounded-xl text-sm bg-gray-50 outline-none focus:border-black transition-colors"
                                    rows={3}
                                    value={editForm.about}
                                    onChange={e => setEditForm({...editForm, about: e.target.value})}
                                    placeholder="Tell us about yourself"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Wallet Address</label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        className="w-full p-2 pl-10 border rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors font-mono" 
                                        placeholder="0x..."
                                        value={editForm.walletAddress}
                                        onChange={e => setEditForm({...editForm, walletAddress: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Socials</label>
                                    <input 
                                        className="w-full p-2 border rounded-lg text-sm bg-gray-50 mb-2 outline-none focus:border-black transition-colors" 
                                        placeholder="Twitter Handle (no @)"
                                        value={editForm.twitter}
                                        onChange={e => setEditForm({...editForm, twitter: e.target.value})}
                                    />
                                    <input 
                                        className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors" 
                                        placeholder="Telegram Username"
                                        value={editForm.telegram}
                                        onChange={e => setEditForm({...editForm, telegram: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                    <Save size={14}/> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">About</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {user.about || "No bio yet. Click edit to add one!"}
                                </p>
                            </div>
                            {user.walletAddress && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Wallet size={14} /> Wallet Address
                                     </h4>
                                     <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 break-all select-all">
                                        {user.walletAddress}
                                     </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Achievements & Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Badges / Achievements Section */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Award className="text-orange-500" /> Achievements
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {user.badges && user.badges.length > 0 ? (
                            user.badges.map((badge) => (
                                <div key={badge.id} className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${badge.color || 'bg-gray-50 border-gray-100'} transition-transform hover:scale-105 cursor-default group relative text-center`}>
                                    <span className="text-3xl mb-2">{badge.icon}</span>
                                    <div className="text-sm font-bold text-gray-900">{badge.name}</div>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                                        {badge.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="text-gray-400 italic mb-2">No badges earned yet.</div>
                                <div className="text-xs text-gray-500">Rank in the top 3 on the leaderboard to earn badges.</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submissions History */}
                <div>
                     <h3 className="text-xl font-bold mb-4 px-2">Submission History</h3>
                     <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
                        No past submissions found. Start building!
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;