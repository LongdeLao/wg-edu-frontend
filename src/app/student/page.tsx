'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock } from 'lucide-react';

// Mock data - replace with actual API calls
const nextClass = {
  subject: '物理 HL',
  grade: 'IB1',
  time: '2024-10-15T14:00:00',
  duration: 60,
  topic: 'Mechanics: Forces and Motion',
  meetingLink: 'meeting.tencent.com/s/abcDEF123',
  passcode: '123456',
  teacher: 'Ms. Zhang'
};

const classCredits = {
  smallGroup: 8,
  oneOnOne: 4
};

const upcomingClasses = [
  {
    id: 1,
    subject: '数学 SL',
    grade: 'IB1',
    time: '2024-10-16T15:30:00',
    duration: 60,
    topic: 'Calculus: Derivatives',
    teacher: 'Mr. Li'
  },
  {
    id: 2,
    subject: '英语 B HL',
    grade: 'IB1',
    time: '2024-10-17T16:00:00',
    duration: 90,
    topic: 'Essay Writing',
    teacher: 'Ms. Wilson'
  }
];

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if user is logged in and is student
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'student') {
        router.push('/');
        return;
      }
      
      // Store user role for component access
      localStorage.setItem('userRole', parsedUser.role);
      
      setUser(parsedUser);
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      month: 'numeric', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const getTimeUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return '进行中';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24);
      return `${days}天后`;
    }
    
    if (diffHrs > 0) {
      return `${diffHrs}小时${diffMins}分钟后`;
    }
    
    return `${diffMins}分钟后`;
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="px-5 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-normal">{user.first_name || user.username}</h1>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-black"
          >
            退出
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-10">
        {/* Next Class */}
        <section>
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4" />
            <h2 className="text-base font-medium">下一节课</h2>
          </div>
          
          <div className="mt-4 border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium">{nextClass.subject}</h3>
                <div className="text-sm text-gray-500 mt-1">{nextClass.grade} · {nextClass.topic}</div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(nextClass.time)} {formatTime(nextClass.time)}
                <div className="text-right">{getTimeUntil(nextClass.time)}</div>
              </div>
            </div>
            
            <div className="flex items-center mt-6 mb-4">
              <div className="w-6 h-6 mr-3">
                <Image 
                  src="/tencent-meeting-1.svg" 
                  alt="Tencent Meeting" 
                  width={24} 
                  height={24} 
                />
              </div>
              <div>
                <div className="text-sm">{nextClass.meetingLink}</div>
                <div className="text-sm text-gray-500">密码: {nextClass.passcode}</div>
              </div>
            </div>
            
            <button 
              className="w-full py-2 mt-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-md text-sm"
              onClick={() => window.open(`https://${nextClass.meetingLink}`, '_blank')}
            >
              加入课堂
            </button>
          </div>
        </section>

        {/* Class Credits */}
        <section>
          <h2 className="text-base font-medium mb-3">课时余额</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl">{classCredits.smallGroup}</div>
              <div className="text-sm text-gray-500 mt-1">小班课</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl">{classCredits.oneOnOne}</div>
              <div className="text-sm text-gray-500 mt-1">1V1 课</div>
            </div>
          </div>
        </section>

        {/* Upcoming Classes */}
        <section>
          <h2 className="text-base font-medium mb-3">即将到来的课程</h2>
          <div className="space-y-3">
            {upcomingClasses.map(cls => (
              <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{cls.subject}</div>
                    <div className="text-sm text-gray-500 mt-1">{cls.topic}</div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {formatDate(cls.time)}
                    <div>{formatTime(cls.time)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 