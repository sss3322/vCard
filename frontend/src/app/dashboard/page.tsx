'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Link as LinkIcon, Save, Video, User, Briefcase, Phone, Globe, Loader2, Sparkles, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactDetail {
    type: string;
    value: string;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface WebLink {
    title: string;
    url: string;
}

interface VCardForm {
    name: string;
    jobTitle: string;
    companyName: string;
    heading: string;
    description: string;
    videoUrl: string;
    contactDetails: ContactDetail[];
    socialLinks: SocialLink[];
    webLinks: WebLink[];
}

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<VCardForm>({
        defaultValues: {
            name: '',
            jobTitle: '',
            companyName: '',
            heading: '',
            description: '',
            videoUrl: '',
            contactDetails: [],
            socialLinks: [],
            webLinks: []
        }
    });

    const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({ control, name: 'contactDetails' });
    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control, name: 'socialLinks' });
    const { fields: webFields, append: appendWeb, remove: removeWeb } = useFieldArray({ control, name: 'webLinks' });

    useEffect(() => {
        fetchCard();
    }, []);

    const fetchCard = async () => {
        try {
            const res = await api.get('/vcard/me');
            if (res.data) {
                reset(res.data);
                setUserId(res.data.userId);
            } else {
                const userRes = await api.get('/auth/me');
                reset({ name: userRes.data.name });
                setUserId(userRes.data.userId);
            }
        } catch (err) {
            try {
                const userRes = await api.get('/auth/me');
                reset({ name: userRes.data.name });
                setUserId(userRes.data.userId);
            } catch (e) {
                router.push('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: VCardForm) => {
        setSaving(true);
        try {
            try {
                await api.post('/vcard', data);
                toast.success('vCard Created!');
            } catch (postErr: any) {
                if (postErr.response?.status === 409) {
                    await api.patch('/vcard', data);
                    toast.success('vCard Updated Successfully!');
                } else {
                    throw postErr;
                }
            }
        } catch (err: any) {
            toast.error('Failed to save vCard');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            {/* Navbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            vCard<span className="text-slate-400">Editor</span>
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        {userId && (
                            <a href={`/v/${userId}`} target="_blank" className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center gap-2 font-medium text-sm">
                                <Sparkles size={16} /> View Live Card
                            </a>
                        )}
                        <button onClick={() => { localStorage.removeItem('token'); router.push('/auth/login'); }} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section 1: Basic Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                            <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                <input {...register('name')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium placeholder:text-slate-400" placeholder="e.g. Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Job Title</label>
                                <input {...register('jobTitle')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium placeholder:text-slate-400" placeholder="e.g. Product Designer" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Company Name</label>
                                <input {...register('companyName')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium placeholder:text-slate-400" placeholder="e.g. Acme Corp" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Intro */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Briefcase size={20} /></div>
                            <h2 className="text-lg font-bold text-slate-800">Introduction</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Heading (Short)</label>
                                <input {...register('heading')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium placeholder:text-slate-400" placeholder="Helping brands grow..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description (Long)</label>
                                <textarea {...register('description')} rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium placeholder:text-slate-400 resize-none" placeholder="Write a short bio about yourself and what you do..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Contact Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone size={20} /></div>
                                <h2 className="text-lg font-bold text-slate-800">Contact Details</h2>
                            </div>
                            <button type="button" onClick={() => appendContact({ type: 'MOBILE', value: '' })} className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition flex items-center gap-1">
                                <Plus size={14} /> ADD ITEM
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            {contactFields.length === 0 && <p className="text-slate-400 text-sm italic text-center">No contact info added yet.</p>}
                            {contactFields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition">
                                    <select {...register(`contactDetails.${index}.type` as const)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none font-medium w-36 shadow-sm">
                                        <option value="MOBILE">Mobile</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="ADDRESS">Address</option>
                                    </select>
                                    <input {...register(`contactDetails.${index}.value` as const)} className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition shadow-sm" placeholder="Value" />
                                    <button type="button" onClick={() => removeContact(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Social Links */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Globe size={20} /></div>
                                <h2 className="text-lg font-bold text-slate-800">Social Profiles</h2>
                            </div>
                            <button type="button" onClick={() => appendSocial({ platform: 'Instagram', url: '' })} className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-lg transition flex items-center gap-1">
                                <Plus size={14} /> ADD ITEM
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            {socialFields.length === 0 && <p className="text-slate-400 text-sm italic text-center">No social links added yet.</p>}
                            {socialFields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition">
                                    <input {...register(`socialLinks.${index}.platform` as const)} className="w-40 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition shadow-sm" placeholder="Platform (e.g. LinkedIn)" />
                                    <input {...register(`socialLinks.${index}.url` as const)} className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition shadow-sm" placeholder="URL" />
                                    <button type="button" onClick={() => removeSocial(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 5: Web Links */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><LinkIcon size={20} /></div>
                                <h2 className="text-lg font-bold text-slate-800">External Links</h2>
                            </div>
                            <button type="button" onClick={() => appendWeb({ title: '', url: '' })} className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition flex items-center gap-1">
                                <Plus size={14} /> ADD ITEM
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            {webFields.length === 0 && <p className="text-slate-400 text-sm italic text-center">No links added yet.</p>}
                            {webFields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition">
                                    <input {...register(`webLinks.${index}.title` as const)} className="w-1/3 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm font-medium" placeholder="Title" />
                                    <input {...register(`webLinks.${index}.url` as const)} className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm" placeholder="URL" />
                                    <button type="button" onClick={() => removeWeb(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 6: Video */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Video size={20} /></div>
                            <h2 className="text-lg font-bold text-slate-800">Video Links</h2>
                            {/* <h2 className="text-lg font-bold text-slate-800">Featured Video</h2> */}
                        </div>
                        <div className="p-8">
                            <input {...register('videoUrl')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-medium placeholder:text-slate-400" placeholder="https://youtube.com/..." />
                        </div>
                    </div>

                    <div className="sticky bottom-6 z-20">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition disabled:opacity-50 shadow-xl shadow-slate-300"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
