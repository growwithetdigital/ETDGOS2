import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, LogIn, LogOut, Check, ArrowUpRight, Loader2, Database, 
  FileSpreadsheet, FileText, Mail, Sparkles, Plus, RefreshCw, Trash2, Globe, X,
  Calendar, Video, GraduationCap, Clock, Bell, BookOpen
} from 'lucide-react';
import { 
  googleSignIn, 
  googleSignOut, 
  initAuth, 
  getAccessToken,
  fetchBookingsFromFirestore,
  deleteBookingFromFirestore,
  createGoogleForm,
  createGoogleSheet,
  listWorkspaceFilesFromDrive,
  uploadBriefToGoogleDrive,
  sendGmailMessage,
  listGoogleCalendarEvents,
  createGoogleCalendarEvent,
  createGoogleMeetSpaceDirect,
  listGoogleClassroomCourses,
  createGoogleClassroomCourse,
  createGoogleClassroomAnnouncement,
  BookingLead,
  GoogleFormInfo,
  GoogleSpreadsheetInfo,
  GoogleDriveFileInfo,
  GoogleCalendarEvent,
  GoogleMeetSpace,
  GoogleClassroomCourse
} from '../lib/firebase';
import { User } from 'firebase/auth';

interface WorkspaceHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceHub({ isOpen, onClose }: WorkspaceHubProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'leads' | 'workspace' | 'calendar' | 'classroom'>('leads');

  // Data State
  const [bookings, setBookings] = useState<BookingLead[]>([]);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFileInfo[]>([]);
  const [activeSheet, setActiveSheet] = useState<GoogleSpreadsheetInfo | null>(null);
  const [activeForm, setActiveForm] = useState<GoogleFormInfo | null>(null);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('');
  const [newEventEnd, setNewEventEnd] = useState('');
  const [newEventWithMeet, setNewEventWithMeet] = useState(true);

  // Meet Space State
  const [activeMeetSpace, setActiveMeetSpace] = useState<GoogleMeetSpace | null>(null);

  // Classroom State
  const [classroomCourses, setClassroomCourses] = useState<GoogleClassroomCourse[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseSection, setNewCourseSection] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  
  // Gmail manual sender
  const [emailTarget, setEmailTarget] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // UI status logs
  const [statusLog, setStatusLog] = useState<string[]>(['Firebase Engine Loaded.']);

  const appendLog = (msg: string) => {
    setStatusLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, activeToken) => {
        setUser(currentUser);
        setToken(activeToken);
        appendLog(`Authenticated: ${currentUser.email}`);
        loadAllData(activeToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setDriveFiles([]);
        setCalendarEvents([]);
        setClassroomCourses([]);
      }
    );

    // Initial check for sheet ID stored locally
    const storedSheetId = localStorage.getItem('et_digital_sheet_id');
    const storedSheetTitle = localStorage.getItem('et_digital_sheet_title') || 'ET Digital Active Leads';
    if (storedSheetId) {
      setActiveSheet({
        spreadsheetId: storedSheetId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${storedSheetId}/edit`,
        properties: { title: storedSheetTitle }
      });
    }

    // Initial check for form ID stored locally
    const storedFormId = localStorage.getItem('et_digital_form_id');
    const storedFormUrl = localStorage.getItem('et_digital_form_url');
    if (storedFormId && storedFormUrl) {
      setActiveForm({
        formId: storedFormId,
        info: { title: 'ET Digital Branded Form' },
        responderUri: storedFormUrl
      });
    }

    return () => unsubscribe();
  }, []);

  // Sync specific tabs on tab activation or token verification
  useEffect(() => {
    if (token) {
      if (activeTab === 'calendar') {
        loadCalendarEvents();
      } else if (activeTab === 'classroom') {
        loadClassroomCourses();
      } else if (activeTab === 'leads') {
        loadFirestoreBookings();
      } else if (activeTab === 'workspace') {
        loadDriveFiles();
      }
    }
  }, [activeTab, token]);

  const loadAllData = async (activeToken?: string) => {
    setLoading(true);
    await loadFirestoreBookings();
    
    const currentToken = activeToken || token;
    if (currentToken) {
      await loadDriveFiles();
      await loadCalendarEvents();
      await loadClassroomCourses();
    }
    setLoading(false);
  };

  const loadFirestoreBookings = async () => {
    try {
      const data = await fetchBookingsFromFirestore();
      setBookings(data);
      appendLog(`Fetched ${data.length} leads from Cloud Firestore.`);
    } catch (err) {
      console.error(err);
      appendLog('Firestore fetch skipped or unauthenticated.');
    }
  };

  const loadDriveFiles = async () => {
    try {
      const files = await listWorkspaceFilesFromDrive();
      setDriveFiles(files);
      appendLog(`Fetched ${files.length} active Workspace files from Google Drive.`);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCalendarEvents = async () => {
    try {
      const events = await listGoogleCalendarEvents();
      setCalendarEvents(events);
      appendLog(`Fetched ${events.length} Google Calendar appointments.`);
    } catch (err) {
      console.error(err);
    }
  };

  const loadClassroomCourses = async () => {
    try {
      const courses = await listGoogleClassroomCourses();
      setClassroomCourses(courses);
      if (courses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courses[0].id);
      }
      appendLog(`Fetched ${courses.length} active Classroom Courses.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn(true);
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        appendLog(`Google Workspace authorized.`);
        await loadAllData(result.accessToken);
      }
    } catch (err: any) {
      appendLog(`Auth Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setDriveFiles([]);
      setCalendarEvents([]);
      setClassroomCourses([]);
      appendLog('Google session logged out.');
    } catch (err: any) {
      appendLog(`Sign out failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Calendar Event with Meet Integration
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) return;
    setLoading(true);
    try {
      const event = await createGoogleCalendarEvent(
        newEventTitle,
        'Scheduled via ET Digital Workspace Hub',
        new Date(newEventStart).toISOString(),
        new Date(newEventEnd).toISOString(),
        newEventWithMeet
      );
      appendLog(`Calendar Event Created: "${event.summary}"`);
      if (event.hangoutLink) {
        appendLog(`Google Meet video link: ${event.hangoutLink}`);
      }
      setNewEventTitle('');
      setNewEventStart('');
      setNewEventEnd('');
      await loadCalendarEvents();
    } catch (err: any) {
      appendLog(`Calendar Event Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Standalone Google Meet Space Direct
  const handleCreateMeetSpace = async () => {
    setLoading(true);
    try {
      const space = await createGoogleMeetSpaceDirect();
      setActiveMeetSpace(space);
      appendLog(`Standalone Meet Room created! URL: ${space.meetingUri}`);
    } catch (err: any) {
      appendLog(`Meet API Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Classroom Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    setLoading(true);
    try {
      const course = await createGoogleClassroomCourse(
        newCourseName,
        newCourseSection || 'Section 1',
        newCourseDescription || 'ET Digital Masterclass Academy'
      );
      appendLog(`Classroom Course Created: "${course.name}"`);
      setNewCourseName('');
      setNewCourseSection('');
      setNewCourseDescription('');
      await loadClassroomCourses();
    } catch (err: any) {
      appendLog(`Classroom Course Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Post Classroom Announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !announcementText) return;
    setLoading(true);
    try {
      await createGoogleClassroomAnnouncement(selectedCourseId, announcementText);
      appendLog(`Classroom Announcement posted successfully!`);
      setAnnouncementText('');
    } catch (err: any) {
      appendLog(`Classroom Announcement Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. Create Branded Form in Workspace (Google Forms Integration)
  const handleCreateForm = async () => {
    setLoading(true);
    try {
      const form = await createGoogleForm(
        'ET Digital Client Intake Form',
        'Official ET Digital Branded Intake Form'
      );
      setActiveForm(form);
      localStorage.setItem('et_digital_form_id', form.formId);
      localStorage.setItem('et_digital_form_url', form.responderUri);
      appendLog(`Form Created! Responder URI: ${form.responderUri}`);
      await loadDriveFiles();
    } catch (err: any) {
      appendLog(`Form Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create Branded Google Sheet (Google Sheets Integration)
  const handleCreateSheet = async () => {
    setLoading(true);
    try {
      const sheet = await createGoogleSheet('ET Digital Lead Sync Hub');
      setActiveSheet(sheet);
      localStorage.setItem('et_digital_sheet_id', sheet.spreadsheetId);
      localStorage.setItem('et_digital_sheet_title', sheet.properties.title);
      appendLog(`Spreadsheet Provisioned! ID: ${sheet.spreadsheetId}`);
      await loadDriveFiles();
    } catch (err: any) {
      appendLog(`Sheet Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Lead Submission (Firestore CRUD)
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking lead from Firebase Firestore?')) return;
    try {
      await deleteBookingFromFirestore(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      appendLog(`Lead document deleted.`);
    } catch (err: any) {
      appendLog(`Delete failed: ${err.message || err}`);
    }
  };

  // 4. Send Custom Email via Gmail API (Gmail Integration)
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTarget) return;
    setEmailStatus('sending');
    try {
      const bodyHTML = `
        <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #06b6d4; border-radius: 16px; background-color: #0f172a; color: #ffffff;">
          <h2 style="color: #06b6d4; font-weight: 900; margin-top: 0; font-family: monospace;">ET DIGITAL CONSOLE ALERT</h2>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            Your Gmail integration is successfully authorized! This is a dynamic verification email sent on behalf of <strong>ET Digital Workspace Hub</strong>.
          </p>
          <div style="border-left: 4px solid #06b6d4; background-color: #1e293b; padding: 12px; margin: 18px 0; border-radius: 4px;">
            <code style="color: #22d3ee;">STATUS CODE: 200 SUCCESS</code>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
            This email was triggered programmatically via Google APIs.
          </p>
        </div>
      `;
      await sendGmailMessage(emailTarget, 'ET Digital Workspace API Verification', bodyHTML);
      setEmailStatus('success');
      appendLog(`Verification Email sent to ${emailTarget}`);
      setEmailTarget('');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setEmailStatus('error');
      appendLog(`Gmail Error: ${err.message || err}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            id="hub-overlay"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl z-10 select-none text-left"
            id="workspace-hub-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800/80 bg-slate-950/40 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950 border border-brand-cyan/20 rounded-xl">
                  <Settings className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-white uppercase tracking-wider">
                    Workspace & Firebase Hub
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500">ET DIGITAL CONSOLE SYSTEMS</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                    id="hub-signout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    DISCONNECT
                  </button>
                ) : (
                  <button 
                    onClick={handleSignIn}
                    className="flex items-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 px-4.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer"
                    id="hub-signin-btn"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    AUTHORIZE GOOGLE
                  </button>
                )}
                
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                  id="hub-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Tabs Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-6 overflow-x-auto shrink-0 scrollbar-none">
              <button 
                onClick={() => setActiveTab('leads')}
                className={`py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'leads' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Leads & Database
              </button>
              <button 
                onClick={() => setActiveTab('workspace')}
                className={`py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'workspace' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Workspace Files
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'calendar' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Calendar & Meet
              </button>
              <button 
                onClick={() => setActiveTab('classroom')}
                className={`py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'classroom' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Classroom Academy
              </button>
            </div>

            {/* Dashboard Workspace Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900">
              
              {/* Left Column: Active Tab Pane (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Leads Tab */}
                {activeTab === 'leads' && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col flex-1 min-h-[350px]">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                          Firestore Bookings List
                        </h4>
                      </div>
                      <button 
                        onClick={loadFirestoreBookings}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer animate-none"
                        title="Reload Firestore"
                        id="reload-firestore-btn"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
                      {bookings.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10">
                          <Database className="w-8 h-8 text-slate-700 mb-2" />
                          <span className="text-xs text-slate-500">No submission records in Cloud Firestore.</span>
                        </div>
                      ) : (
                        bookings.map((booking) => (
                          <div 
                            key={booking.id}
                            className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{booking.name}</span>
                                <span className="text-[9px] font-mono bg-cyan-950/80 border border-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full">
                                  {booking.objective}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                <span>{booking.company} &bull; {booking.email}</span>
                              </div>
                              {booking.notes && (
                                <p className="text-[10px] text-slate-500 italic font-sans max-w-md line-clamp-1">
                                  "{booking.notes}"
                                </p>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => booking.id && handleDeleteBooking(booking.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                              title="Delete Lead document"
                              id={`delete-booking-${booking.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Workspace Files Tab */}
                {activeTab === 'workspace' && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col flex-1 gap-5 min-h-[350px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                          Workspace Document Operations
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-5 overflow-y-auto max-h-[380px] pr-1">
                      {/* Google Sheets Module */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                            Google Sheets Sync Tracker
                          </span>
                          {token && !activeSheet && (
                            <button 
                              onClick={handleCreateSheet}
                              disabled={loading}
                              className="text-[9px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-1 rounded-md hover:bg-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" /> PROVISION
                            </button>
                          )}
                        </div>

                        {activeSheet ? (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]">
                            <span className="text-slate-300 font-bold max-w-[180px] truncate">
                              🟢 {activeSheet.properties.title}
                            </span>
                            <a 
                              href={activeSheet.spreadsheetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-cyan hover:underline flex items-center gap-0.5"
                            >
                              VIEW <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 block font-sans">No tracking spreadsheet provisioned.</span>
                        )}
                      </div>

                      {/* Google Forms Module */}
                      <div className="space-y-2 pt-3 border-t border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-purple-400" />
                            Google Forms Generation Link
                          </span>
                          {token && !activeForm && (
                            <button 
                              onClick={handleCreateForm}
                              disabled={loading}
                              className="text-[9px] font-mono bg-purple-950 border border-purple-800 text-purple-300 px-2 py-1 rounded-md hover:bg-purple-900 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" /> CREATE
                            </button>
                          )}
                        </div>

                        {activeForm ? (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]">
                            <span className="text-slate-300 font-bold max-w-[180px] truncate">
                              🟣 Branded Intake Form
                            </span>
                            <a 
                              href={activeForm.responderUri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-cyan hover:underline flex items-center gap-0.5"
                            >
                              LINK <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 block font-sans">No programmatically generated Google Intake Form active.</span>
                        )}
                      </div>

                      {/* Google Drive Files Explorer */}
                      <div className="space-y-2 pt-3 border-t border-slate-900">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          Google Drive Files
                        </span>
                        
                        <div className="bg-slate-900 rounded-xl p-3 max-h-[100px] overflow-y-auto space-y-1.5 text-[10px] border border-slate-850">
                          {driveFiles.length === 0 ? (
                            <span className="text-slate-500 italic block font-sans">Authorize Workspace to discover generated documents.</span>
                          ) : (
                            driveFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between text-slate-300 font-mono">
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                {file.webViewLink ? (
                                  <a 
                                    href={file.webViewLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-brand-cyan hover:underline flex items-center gap-0.5 shrink-0"
                                  >
                                    VIEW <ArrowUpRight className="w-2.5 h-2.5" />
                                  </a>
                                ) : (
                                  <span className="text-slate-500">SAVED</span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Gmail Verification Sender */}
                      <form onSubmit={handleSendEmail} className="space-y-2 pt-3 border-t border-slate-900">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-rose-400" />
                          Gmail Mailer Verification
                        </span>
                        
                        <div className="flex gap-2">
                          <input 
                            type="email"
                            required
                            disabled={!token || emailStatus === 'sending'}
                            placeholder="recipient@gmail.com"
                            value={emailTarget}
                            onChange={e => setEmailTarget(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-cyan/50 text-white disabled:opacity-50"
                          />
                          <button 
                            type="submit"
                            disabled={!token || emailStatus === 'sending'}
                            className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[9px] font-black uppercase tracking-widest px-3.5 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            {emailStatus === 'sending' ? (
                              <Loader2 className="w-3 h-3 animate-spin text-slate-950" />
                            ) : (
                              'SEND'
                            )}
                          </button>
                        </div>
                        
                        {emailStatus === 'success' && (
                          <span className="text-[9px] text-emerald-400 block font-mono">🟢 Verification Email sent successfully via Gmail!</span>
                        )}
                        {emailStatus === 'error' && (
                          <span className="text-[9px] text-red-400 block font-mono">🔴 Failed to dispatch email. Verify authorization.</span>
                        )}
                      </form>
                    </div>
                  </div>
                )}

                {/* 3. Calendar & Meet Tab */}
                {activeTab === 'calendar' && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col flex-1 gap-5 min-h-[350px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                          Google Calendar & Meet Systems
                        </h4>
                      </div>
                      {token && (
                        <button 
                          onClick={loadCalendarEvents}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Reload Calendar"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto max-h-[380px] pr-1">
                      {/* Left Grid: Upcoming appointments */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          Upcoming Schedules
                        </span>

                        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                          {!token ? (
                            <span className="text-[10px] text-slate-500 italic font-sans block">Authorize Workspace to view calendar.</span>
                          ) : calendarEvents.length === 0 ? (
                            <span className="text-[10px] text-slate-500 italic font-sans block">No upcoming appointments found.</span>
                          ) : (
                            calendarEvents.map((event) => (
                              <div key={event.id} className="p-3 bg-slate-900/60 border border-slate-800/50 rounded-xl space-y-1.5 text-[11px] hover:border-slate-800 transition-all">
                                <div className="font-bold text-slate-200 line-clamp-1">{event.summary}</div>
                                <div className="text-[9px] font-mono text-slate-400">
                                  {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start?.date}
                                </div>
                                {event.hangoutLink && (
                                  <a 
                                    href={event.hangoutLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[9px] font-mono text-cyan-400 hover:underline bg-cyan-950/40 border border-cyan-900/40 px-2.5 py-1 rounded-md"
                                  >
                                    <Video className="w-2.5 h-2.5" /> Join Google Meet
                                  </a>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Standalone Instant Google Meet Creator */}
                        <div className="pt-3 border-t border-slate-900 space-y-2">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Video className="w-3.5 h-3.5 text-cyan-400" />
                            Google Meet Creator
                          </span>
                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                            Instantly provision an encrypted standalone Google Meet meeting room code.
                          </p>
                          {activeMeetSpace ? (
                            <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/50 rounded-xl flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-300">Room: {activeMeetSpace.meetingCode || 'Generated'}</span>
                              <a 
                                href={activeMeetSpace.meetingUri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-brand-cyan hover:underline flex items-center gap-0.5"
                              >
                                LAUNCH <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <button 
                              onClick={handleCreateMeetSpace}
                              disabled={!token || loading}
                              className="w-full py-2 bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-800/40 hover:border-brand-cyan/50 text-brand-cyan hover:text-white rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Video className="w-3 h-3" /> GENERATE STANDALONE MEET LINK
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right Grid: Schedule Appointment Form */}
                      <form onSubmit={handleCreateEvent} className="space-y-3 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                        <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800/60 pb-1.5 block">
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          Schedule Appointment
                        </span>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-slate-400 block">EVENT SUMMARY</label>
                          <input 
                            type="text" 
                            required
                            disabled={!token}
                            placeholder="Client Discovery Strategy Session"
                            value={newEventTitle}
                            onChange={e => setNewEventTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50 disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-slate-400 block">START TIME</label>
                          <input 
                            type="datetime-local" 
                            required
                            disabled={!token}
                            value={newEventStart}
                            onChange={e => setNewEventStart(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50 disabled:opacity-50 font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-slate-400 block">END TIME</label>
                          <input 
                            type="datetime-local" 
                            required
                            disabled={!token}
                            value={newEventEnd}
                            onChange={e => setNewEventEnd(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50 disabled:opacity-50 font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="checkbox" 
                            id="with-meet-cb"
                            disabled={!token}
                            checked={newEventWithMeet}
                            onChange={e => setNewEventWithMeet(e.target.checked)}
                            className="rounded border-slate-800 bg-slate-950 text-brand-cyan focus:ring-brand-cyan accent-brand-cyan"
                          />
                          <label htmlFor="with-meet-cb" className="text-[10px] text-slate-400 font-sans cursor-pointer select-none">
                            Attach auto Google Meet Video Room
                          </label>
                        </div>

                        <button 
                          type="submit"
                          disabled={!token || loading}
                          className="w-full py-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
                        >
                          BOOK CALENDAR APPOINTMENT
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. Classroom Academy Tab */}
                {activeTab === 'classroom' && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex flex-col flex-1 gap-5 min-h-[350px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                          Google Classroom Academies
                        </h4>
                      </div>
                      {token && (
                        <button 
                          onClick={loadClassroomCourses}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Reload Courses"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto max-h-[380px] pr-1">
                      {/* Left Grid: Active Courses list & Broadcaster Selection */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          Active Growth Courses
                        </span>

                        <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                          {!token ? (
                            <span className="text-[10px] text-slate-500 italic font-sans block">Authorize Workspace to list courses.</span>
                          ) : classroomCourses.length === 0 ? (
                            <span className="text-[10px] text-slate-500 italic font-sans block">No course academies created.</span>
                          ) : (
                            classroomCourses.map((course) => (
                              <button 
                                key={course.id}
                                onClick={() => setSelectedCourseId(course.id)}
                                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-0.5 cursor-pointer ${
                                  selectedCourseId === course.id 
                                    ? 'bg-purple-950/20 border-purple-500/50 text-white' 
                                    : 'bg-slate-900/40 border-slate-800/55 text-slate-400 hover:border-slate-800'
                                }`}
                              >
                                <span className="font-bold">{course.name}</span>
                                <span className="text-[9px] font-mono text-slate-400 truncate max-w-[180px]">{course.section || 'General'}</span>
                              </button>
                            ))
                          )}
                        </div>

                        {/* Course Announcement Broadcaster */}
                        <form onSubmit={handlePostAnnouncement} className="pt-3 border-t border-slate-900 space-y-2">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5 text-purple-400" />
                            Course Announcement Broadcaster
                          </span>
                          
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-400 block">SELECT ACADEMY COURSE</label>
                            <select 
                              value={selectedCourseId}
                              onChange={e => setSelectedCourseId(e.target.value)}
                              disabled={!token || classroomCourses.length === 0}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                            >
                              {classroomCourses.length === 0 && <option value="">No Active Courses</option>}
                              {classroomCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-400 block">ANNOUNCEMENT TEXT</label>
                            <textarea 
                              required
                              disabled={!token || !selectedCourseId}
                              placeholder="Welcome to ET Digital Course Academy! The onboarding documentation and strategy blueprints have been uploaded to Drive."
                              value={announcementText}
                              onChange={e => setAnnouncementText(e.target.value)}
                              rows={2}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50 resize-none font-sans"
                            />
                          </div>

                          <button 
                            type="submit"
                            disabled={!token || !selectedCourseId || loading}
                            className="w-full py-1.5 bg-purple-950 border border-purple-800 text-purple-300 hover:text-white rounded-lg text-[10px] font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            BROADCAST TO STREAM
                          </button>
                        </form>
                      </div>

                      {/* Right Grid: Create Course Form */}
                      <form onSubmit={handleCreateCourse} className="space-y-3 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800/60 pb-1.5 block">
                            <Plus className="w-3.5 h-3.5 text-purple-400" />
                            Establish Course Academy
                          </span>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-slate-400 block">ACADEMY NAME</label>
                            <input 
                              type="text" 
                              required
                              disabled={!token}
                              placeholder="Growth Hacking & Brand Authority"
                              value={newCourseName}
                              onChange={e => setNewCourseName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-slate-400 block">SECTION</label>
                            <input 
                              type="text" 
                              disabled={!token}
                              placeholder="Cohort 2026 - Masterclass"
                              value={newCourseSection}
                              onChange={e => setNewCourseSection(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-slate-400 block">DESCRIPTION HEADING</label>
                            <input 
                              type="text" 
                              disabled={!token}
                              placeholder="Advanced Scaling Blueprints"
                              value={newCourseDescription}
                              onChange={e => setNewCourseDescription(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={!token || loading}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-display text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer mt-4 disabled:opacity-50"
                        >
                          LAUNCH ACADEMY COURSE
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Google Workspace Modules (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Workspace OAuth Status */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                  <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                    Workspace Auth Status
                  </h4>

                  {user ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-950/20 border border-brand-cyan/20 rounded-xl flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Google Pic" className="w-8 h-8 rounded-full border border-brand-cyan/20" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-brand-cyan font-bold">
                            G
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{user.displayName || 'Authorized Admin'}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                        OAUTH ACCESS TOKEN IS ACTIVE & RETRIEVED
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-xl">
                      <p className="text-xs text-slate-400 mb-3 px-4">
                        Please authorize with Google to connect Sheets, Forms, Calendar, Meet, and Classroom.
                      </p>
                      <button 
                        onClick={handleSignIn}
                        className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer"
                        id="hub-auth-btn-card"
                      >
                        Authorize Workspace APIs
                      </button>
                    </div>
                  )}
                </div>

                {/* System Logs */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 font-mono text-[10px] flex-1 flex flex-col min-h-[180px]">
                  <span className="text-slate-500 uppercase tracking-wider font-extrabold text-[9px] mb-2 block border-b border-slate-900 pb-1.5">
                    API Transaction console logs
                  </span>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-slate-400">
                    {statusLog.map((log, idx) => (
                      <div key={idx} className="truncate select-text">{log}</div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
