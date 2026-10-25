import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Mic, 
  CheckCheck, 
  X, 
  Minus,
  Maximize2,
  Minimize2,
  KeyRound,
  Lock,
  MessageSquare,
  Sparkles,
  Volume2,
  AlertTriangle
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerWorkerChatPopup = ({
  isOpen = false,
  onClose,
  booking = null,
  customer = { name: 'Priya Sharma', phone: '+91 98200 44102' },
  onOpenMap,
  onCancelBooking,
  lang = 'en'
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const worker = booking?.worker;

  // Initialize or update conversation messages when the booking changes
  useEffect(() => {
    if (!worker) return;

    const workerFirstName = worker.name ? worker.name.split(' ')[0] : 'Technician';
    const customerFirstName = customer.name ? customer.name.split(' ')[0] : 'Customer';
    const otp = booking?.startOtp || '4829';
    const amount = booking?.quoteAmount || 350;
    const title = booking?.title || 'Home Repair Service';
    const eta = booking?.etaMins || 8;

    if (lang === 'hi') {
      setMessages([
        {
          id: 1,
          sender: 'system',
          text: `🔒 "${title}" के लिए सीधी चैट सक्रिय। ₹${amount} का एस्क्रो पेमेंट कामवाला के पास सुरक्षित है। कारीगर के दरवाजे पर पहुँचने पर ही शुरुआती OTP ${otp} बताएं।`,
          time: 'अभी'
        },
        {
          id: 2,
          sender: 'worker',
          text: `नमस्ते ${customerFirstName} जी! मैंने आपका काम स्वीकार कर लिया है। मेरे पास जरूरी औजार और पार्ट्स किट में मौजूद हैं। बाइक से निकल चुका हूँ।`,
          time: '2 मि पूर्व'
        },
        {
          id: 3,
          sender: 'customer',
          text: `नमस्ते ${workerFirstName} जी। कृपया पाली हिल मुख्य गेट से आएं। लिफ्ट चालू है और गार्ड को बता दिया है।`,
          time: '1 मि पूर्व'
        },
        {
          id: 4,
          sender: 'worker',
          text: `जी समझ गया! लगभग ~${eta} मिनट में पहुँच जाऊँगा। अभी जंक्शन पार किया है।`,
          time: 'अभी'
        }
      ]);
    } else if (lang === 'mr') {
      setMessages([
        {
          id: 1,
          sender: 'system',
          text: `🔒 "${title}" साठी थेट संभाषण सुरू झाले. ₹${amount} एस्क्रो रक्कम कामवालाकडे सुरक्षित आहे. कारागीर घरी आल्यावरच सुरुवातीचा OTP ${otp} सांगा.`,
          time: 'आत्ताच'
        },
        {
          id: 2,
          sender: 'worker',
          text: `नमस्कार ${customerFirstName} ताई/दादा! मी तुमचे काम स्वीकारले आहे. माझ्याकडे लागणारे सर्व सामान व टूल्स किटमध्ये आहेत. बाईकवरून निघालो आहे.`,
          time: '२ मि आधी'
        },
        {
          id: 3,
          sender: 'customer',
          text: `नमस्कार ${workerFirstName} दादा. मुख्य गेटवरून या. लिफ्ट चालू आहे व सिक्युरिटीला सांगितले आहे.`,
          time: '१ मि आधी'
        },
        {
          id: 4,
          sender: 'worker',
          text: `हो समजले! साधारण ~${eta} मिनिटांत पोहोचत आहे. सिग्नल ओलांडला आहे.`,
          time: 'आत्ताच'
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          sender: 'system',
          text: `🔒 Direct Chat Activated for "${title}". Escrow payment of ₹${amount} is held safely by KaamSetu. Disclose Start OTP ${otp} only when the technician arrives at your door.`,
          time: 'Just now'
        },
        {
          id: 2,
          sender: 'worker',
          text: `Namaste ${customerFirstName} ji! I have accepted your request. I have the necessary tools and standard replacement parts in my kit. Dispatched on my bike now.`,
          time: '2m ago'
        },
        {
          id: 3,
          sender: 'customer',
          text: `Namaste ${workerFirstName} ji. Please take the main gate on Pali Hill road. The lift is working and guard is informed.`,
          time: '1m ago'
        },
        {
          id: 4,
          sender: 'worker',
          text: `Understood! I will reach in about ~${eta} minutes. Just crossed the junction.`,
          time: 'Just now'
        }
      ]);
    }
  }, [booking?.id, worker?.id, lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // If there is NO booked worker, do NOT show anything (no popup, no trigger pill)
  if (!worker) {
    return null;
  }

  const handleSend = (textToSend) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'customer',
      text: messageContent.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    playAudioCue('bid_received');

    // Simulate worker typing and reply after 1.6 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let workerReplies;
      if (lang === 'hi') {
        workerReplies = [
          'जी, बस पहुँच ही रहा हूँ! आपकी गली में मुड़ रहा हूँ।',
          'समझ गया! जरूरी औजार ऊपर लेकर आ रहा हूँ।',
          `नोट कर लिया! कृपया काम शुरू करने के लिए 4 अंकों का OTP ${booking?.startOtp || '4829'} तैयार रखें।`,
          'हाँ जी, मैं मुख्य प्रवेश द्वार के पास पहुँच गया हूँ।'
        ];
      } else if (lang === 'mr') {
        workerReplies = [
          'हो, अगदी जवळ पोहोचलो आहे! तुमच्या गल्लीत वळत आहे.',
          'समजले! लागणारे साहित्य घेऊन वर येत आहे.',
          `नोंद केली! काम सुरू करण्यासाठी 4-अंकी OTP ${booking?.startOtp || '4829'} तयार ठेवा.`,
          'होय, मी मुख्य गेटजवळ आलो आहे.'
        ];
      } else {
        workerReplies = [
          'Ji Priya ji, almost there! Just turning into your lane now.',
          'Understood! Bringing the required tools upstairs.',
          `Noted! Please keep the 4-digit OTP ${booking?.startOtp || '4829'} handy to start work.`,
          'Yes, I have reached near the main entrance gate.'
        ];
      }
      const replyText = workerReplies[Math.floor(Math.random() * workerReplies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'worker',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playAudioCue('match_success');
    }, 1600);
  };

  const quickReplies = [
    t.quickReplyParts || 'Please bring spare parts',
    t.quickReplyGate || 'I am at the building gate',
    t.quickReplyLift || 'Lift is working, 4th floor',
    t.quickReplyLocation || 'What is your exact location now?'
  ];

  const handleVoiceNote = () => {
    handleSend(t.voiceNoteText || '🎙️ Voice Note: "Technician ji, the main water valve is in the dry balcony next to the kitchen."');
  };

  // FLOATING TRIGGER PILL when closed or minimized:
  // Rendered ONLY because a worker IS booked!
  if (!isOpen || isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={() => {
            setIsMinimized(false);
            if (!isOpen && onClose) {
              onClose(true); // Signal to reopen
            }
          }}
          className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-full border-2 border-primary-500 shadow-xl hover:shadow-2xl transition-all group active:scale-95"
          title={`${t.chatPopupTitle ? t.chatPopupTitle.replace('{name}', worker.name) : `Chat with ${worker.name}`}`}
        >
          <div className="relative">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-9 h-9 rounded-full object-cover border border-primary-600 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </div>

          <div className="text-left text-xs pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 group-hover:text-primary-700 transition-colors">
                {t.chatPopupTitle ? t.chatPopupTitle.replace('{name}', worker.name) : `Chat with ${worker.name}`}
              </span>
              <span className="px-1.5 py-0.2 bg-secondary-600 text-white rounded-full text-[9px] font-bold">
                1
              </span>
            </div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-primary-600" />
              <span>~{booking?.etaMins || 8}m • OTP: <strong>{booking?.startOtp || '4829'}</strong></span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-primary-100 group-hover:bg-primary-600 group-hover:text-white text-primary-700 flex items-center justify-center transition-colors">
            <MessageSquare className="w-4 h-4" />
          </div>
        </button>
      </div>
    );
  }

  // ACTIVE EXPANDED POPUP WINDOW
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
      
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-primary-500 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-display font-bold text-slate-900 text-sm truncate">
                {worker.name}
              </h4>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
              <span className="text-primary-700 font-bold">{worker.tradeLabel || t.chatVerifiedPro}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                ~{booking?.etaMins || 8} min
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Map Link */}
          {onOpenMap && (
            <button
              onClick={() => {
                onOpenMap();
                setIsMinimized(true);
              }}
              className="p-1.5 rounded-xl text-slate-600 hover:text-primary-700 hover:bg-slate-200 transition-colors"
              title={t.btnTrackMap}
            >
              <MapPin className="w-4 h-4 text-primary-600" />
            </button>
          )}

          {/* Voice Call */}
          <a
            href={`tel:${worker.phone || '+919820044102'}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Calling assigned technician ${worker.name} at ${worker.phone || '+91 98200 44102'} via masked relay.`);
            }}
            className="p-1.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-200 transition-colors"
            title={t.callBtn}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
          </a>

          {/* Cancel Booking from Chat Popup */}
          {onCancelBooking && (
            <button
              onClick={() => onCancelBooking(booking)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title={t.cancelBookingBtn}
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </button>
          )}

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title={t.btnClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Escrow & OTP Trust Ribbon */}
      <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900 font-semibold shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">₹{booking?.quoteAmount || 350} {t.heldInEscrow}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
            <span className="text-[10px] text-slate-500">OTP:</span>
            <span className="text-secondary-600 font-black">{booking?.startOtp || '4829'}</span>
          </div>
          {onCancelBooking && (
            <button
              onClick={() => onCancelBooking(booking)}
              className="text-[10px] font-bold text-rose-600 hover:text-rose-800 hover:underline"
              title={t.cancelBookingBtn}
            >
              {t.cancelBtn}
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="text-center my-1">
                <div className="inline-block px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed max-w-[92%]">
                  {msg.text}
                </div>
              </div>
            );
          }

          const isMe = msg.sender === 'customer';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-primary-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-teal-200' : 'text-slate-400'}`}>
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-teal-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-2 rounded-2xl border border-slate-200 w-24">
            <span className="font-semibold text-slate-600 text-[10px]">
              {lang === 'hi' ? 'टाइप कर रहे हैं' : lang === 'mr' ? 'टाइप करत आहेत' : 'Typing'}
            </span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 text-[10px] font-semibold border border-slate-200 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={handleVoiceNote}
            className="p-2 rounded-xl bg-slate-100 hover:bg-secondary-50 text-secondary-600 border border-slate-200 transition-colors shrink-0"
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={t.chatPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="btn-primary p-2 sm:px-3 text-xs shadow-xs shrink-0 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
