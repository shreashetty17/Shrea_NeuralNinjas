import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Mic, 
  CheckCheck, 
  Smile, 
  Sparkles,
  X, 
  Maximize2, 
  Minimize2, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerWorkerChat = ({
  currentRole = 'customer', // 'customer' | 'worker'
  worker,
  customer = {
    name: 'Priya Sharma',
    address: 'Flat 402, Sea Green Apts, Pali Hill, Bandra West',
    phone: '+91 98200 44102',
    issue: 'Kitchen Faucet Cartridge Leakage (₹350 in Escrow)'
  },
  onOpenMap,
  onBookWorker,
  isEmbedded = false,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // If NO worker is booked, display locked state!
  if (!worker) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-md p-10 sm:p-14 text-center space-y-5 max-w-xl mx-auto my-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-slate-900">
            {t.chatLockedTitle || 'Chat Locked: Book a Worker First'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.chatLockedDesc || 'Direct two-way messaging unlocks automatically once you accept a worker bid or book a scheduled slot. This protects your privacy and guarantees verified Escrow security.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onBookWorker}
            className="btn-primary text-xs sm:text-sm px-6 py-3 shadow-sm flex items-center gap-2"
          >
            <span>{t.btnBookToChat || 'Post a Request & Book Worker'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const initialMessages = lang === 'hi' ? [
    {
      id: 1,
      sender: 'system',
      text: '🔒 सीधी चैट सक्रिय। ₹350 एस्क्रो राशि कामवाला के पास सुरक्षित है। जब कारीगर पहुँचे तभी 4-अंकों का OTP 4829 बताएं।',
      time: '18:30'
    },
    {
      id: 2,
      sender: 'worker',
      text: 'नमस्ते प्रिया जी! मैंने आपका नल लीकेज का अनुरोध स्वीकार कर लिया है। मेरे पास स्पेयर पार्ट्स और टेफ़लॉन टेप मौजूद हैं। बाइक से निकल चुका हूँ।',
      time: '18:31'
    },
    {
      id: 3,
      sender: 'customer',
      text: 'नमस्ते! कृपया पाली हिल रोड वाला दूसरा गेट लें। लिफ्ट चालू है।',
      time: '18:32'
    },
    {
      id: 4,
      sender: 'worker',
      text: 'जी बिल्कुल! लगभग 8 मिनट में पहुँच रहा हूँ। बांद्रा तालाब पार कर लिया है।',
      time: '18:33'
    }
  ] : lang === 'mr' ? [
    {
      id: 1,
      sender: 'system',
      text: '🔒 थेट चॅट सुरू झाले. ₹350 रक्कम कामवाला एस्क्रोमध्ये सुरक्षित आहे. कारागीर आल्यावरच 4-अंकी OTP 4829 सांगा.',
      time: '18:30'
    },
    {
      id: 2,
      sender: 'worker',
      text: 'नमस्कार प्रिया ताई! मी नळ दुरुस्तीचे काम स्वीकारले आहे. माझ्याजवळ आवश्यक सुटे भाग आहेत. बाईकवरून निघालो आहे.',
      time: '18:31'
    },
    {
      id: 3,
      sender: 'customer',
      text: 'नमस्कार! कृपया पाली हिल रस्त्यावरील दुसरा गेट वापरा. लिफ्ट सुरू आहे.',
      time: '18:32'
    },
    {
      id: 4,
      sender: 'worker',
      text: 'हो नक्की! साधारण 8 मिनिटांत पोहोचतो. वांद्रे तलाव ओलांडला आहे.',
      time: '18:33'
    }
  ] : [
    {
      id: 1,
      sender: 'system',
      text: '🔒 Direct Chat Activated. Job Escrow of ₹350 is held safely by KaamSetu. Disclose OTP 4829 only when the technician arrives.',
      time: '18:30'
    },
    {
      id: 2,
      sender: 'worker',
      text: 'Namaste Priya ji! I have accepted your tap leakage request. I have the standard diverter and teflon tape in my tool kit. Dispatched on my bike.',
      time: '18:31'
    },
    {
      id: 3,
      sender: 'customer',
      text: 'Namaste! Please take the second gate on Pali Hill road. Lift is working.',
      time: '18:32'
    },
    {
      id: 4,
      sender: 'worker',
      text: 'Understood! I will reach in about 8 minutes. Just crossed Bandra Talao.',
      time: '18:33'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentRole,
      text: messageContent.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    playAudioCue('bid_received');

    // Simulate other party typing and replying after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      if (currentRole === 'customer') {
        const workerReplies = lang === 'hi' ? [
          'जी, बस पहुँच ही रहा हूँ! आपकी गली में मुड़ रहा हूँ।',
          'समझ गया, जरूरी स्पेयर पार्ट्स साथ लेकर आ रहा हूँ।',
          'ठीक है! काम शुरू करने के लिए 4 अंकों का OTP 4829 तैयार रखें।',
          'हाँ, मैं मुख्य गेट के पास पहुँच गया हूँ।'
        ] : lang === 'mr' ? [
          'हो, अगदी जवळ पोहोचलो आहे! तुमच्या गल्लीत वळत आहे.',
          'समजले, आवश्यक सुटे भाग सोबत आणत आहे.',
          'होय! काम सुरू करण्यासाठी 4-अंकी OTP 4829 तयार ठेवा.',
          'मी मुख्य प्रवेशद्वाराजवळ पोहोचलो आहे.'
        ] : [
          'Ji Priya ji, almost there! Just turning into your lane now.',
          'Understood, bringing the required spare parts.',
          'Noted! Please keep the 4-digit OTP 4829 handy to commence work.',
          'Yes, I have reached near the main entrance gate.'
        ];
        replyText = workerReplies[Math.floor(Math.random() * workerReplies.length)];
      } else {
        const customerReplies = lang === 'hi' ? [
          'धन्यवाद! गार्ड को बता दिया है, सीधे फ्लैट 402 पर आ जाएँ।',
          'ठीक है, मैं OTP के साथ तैयार हूँ।',
          'बढ़िया, लॉबी में पहुँचकर बताएं।',
          'हाँ, कंपाउंड के अंदर पार्किंग की जगह उपलब्ध है।'
        ] : lang === 'mr' ? [
          'धन्यवाद! वॉचमनला सांगितले आहे, फ्लॅट 402 वर या.',
          'ठीक आहे, मी OTP तयार ठेवला आहे.',
          'छान, खाली पोहोचल्यावर कळवा.',
          'हो, सोसायटीच्या आत पार्किंग उपलब्ध आहे.'
        ] : [
          'Thank you! The guard is informed, please come up to Flat 402.',
          'Got it. I am ready with the OTP.',
          'Great, please let me know when you reach the lobby.',
          'Yes, parking is available inside the compound.'
        ];
        replyText = customerReplies[Math.floor(Math.random() * customerReplies.length)];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: currentRole === 'customer' ? 'worker' : 'customer',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playAudioCue('match_success');
    }, 1800);
  };

  const quickReplies = currentRole === 'customer' 
    ? [
        t.quickReplyParts || 'Please bring spare parts',
        t.quickReplyGate || 'I am at the building gate',
        t.quickReplyLift || 'Lift is working, 4th floor',
        t.quickReplyLocation || 'What is your exact location now?'
      ]
    : lang === 'hi' ? [
        'बिल्डिंग के गेट पर पहुँच गया हूँ!',
        'ट्रैफ़िक के कारण 2 मिनट देर होगी',
        'कृपया 4 अंकों का OTP बताएं',
        'काम पूरा हो गया, कृपया जाँच लें'
      ] : lang === 'mr' ? [
        'इमारतीच्या गेटवर पोहोचलो आहे!',
        'रहदारीमुळे 2 मिनिटे उशीर होईल',
        'कृपया 4-अंकी OTP द्या',
        'काम पूर्ण झाले, कृपया तपासा'
      ] : [
        'Reached your building gate!',
        'Delayed by 2 mins due to traffic',
        'Please share the 4-digit OTP',
        'Work completed, please inspect'
      ];

  const handleVoiceNote = () => {
    const voiceText = currentRole === 'customer' 
      ? (lang === 'hi' 
          ? '🎙️ वॉइस नोट: "कारीगर जी, मुख्य पानी का वाल्व बालकनी में है।"'
          : lang === 'mr'
          ? '🎙️ व्हॉईस नोट: "कारागीर दादा, पाण्याचा मुख्य कॉक गॅलरीत आहे."'
          : '🎙️ Voice Note: "Technician ji, the water valve is in the dry balcony next to kitchen."')
      : (lang === 'hi'
          ? '🎙️ वॉइस नोट: "मैं गेट पर आ गया हूँ, सुरक्षा गार्ड से बात हो गई है।"'
          : lang === 'mr'
          ? '🎙️ व्हॉईस नोट: "मी गेटवर पोहोचलो आहे, वॉचमनने सोडले आहे."'
          : '🎙️ Voice Note: "Reached your building gate, security guard gave access."');
    handleSend(voiceText);
  };

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-bolt-md overflow-hidden ${isEmbedded ? 'h-[620px]' : 'h-[680px]'}`}>
      
      {/* Top Chat Header */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentRole === 'customer' ? worker.photo : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt="Avatar"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-primary-500 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                {currentRole === 'customer' ? worker.name : customer.name}
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {currentRole === 'customer' ? (worker.trade || t.chatVerifiedPro) : t.navRoleCustomer}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 font-semibold text-primary-700">
                <Clock className="w-3 h-3" />
                {worker.eta}
              </span>
              <span>•</span>
              <span className="truncate max-w-[180px] sm:max-w-none">
                {currentRole === 'customer' ? worker.locality : customer.address}
              </span>
            </p>
          </div>
        </div>

        {/* Actions: Map & Call */}
        <div className="flex items-center gap-2">
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.btnTrackMap || 'Track Live Map'}</span>
            </button>
          )}

          <a
            href={`tel:${currentRole === 'customer' ? worker.phone : customer.phone}`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Calling ${currentRole === 'customer' ? worker.name : customer.name} at ${currentRole === 'customer' ? worker.phone : customer.phone}`);
            }}
            className="p-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
            title="Voice Call"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Escrow & OTP Safety Bar */}
      <div className="px-5 py-2 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-semibold">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t.lockedInEscrowLabel ? t.lockedInEscrowLabel.replace('{amount}', '350') : '₹350 held safely in Escrow'}</span>
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
          <span className="text-[10px] text-slate-500">{t.chatOtpPrefix || 'OTP:'}</span>
          <span className="text-secondary-600">{worker.otp}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="text-center my-2">
                <div className="inline-block px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs max-w-md">
                  {msg.text}
                </div>
              </div>
            );
          }

          const isMe = msg.sender === currentRole;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-primary-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-teal-200' : 'text-slate-400'}`}>
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-teal-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-2.5 rounded-2xl border border-slate-200 w-28">
            <span className="font-semibold text-slate-600">Typing</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="p-2 sm:px-4 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceNote}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4 text-secondary-600" />
          </button>

          <input
            type="text"
            placeholder={t.chatPlaceholder || "Type a message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="submit"
            className="btn-primary p-2.5 sm:px-4 sm:py-2.5 text-xs shadow-sm shrink-0"
          >
            <span className="hidden sm:inline">{t.btnSend || 'Send'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
