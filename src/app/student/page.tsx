'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, LogOut, BookOpen, LayoutDashboard, History } from 'lucide-react';

// Mock data - replace with actual API calls
const nextClass = {
  subject: 'PIB 数学AA',
  grade: 'PIB',
  time: '2024-07-15T14:00:00',
  duration: 60,
  topic: 'Polynomials',
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
    subject: 'PIB 物理',
    grade: 'PIB',
    time: '2024-07-16T15:30:00',
    duration: 60,
    topic: 'Forces & Momentum',
    teacher: 'Mr. Li'
  },
  {
    id: 2,
    subject: 'PIB 英语',
    grade: 'PIB',
    time: '2024-07-17T16:00:00',
    duration: 90,
    topic: '阅读tips & tricks',
    teacher: 'Ms. Wilson'
  }
];

const pastClasses = [
  {
    id: 101,
    subject: 'PIB 数学AA',
    date: '2024-07-05',
    time: '14:00-15:00',
    topic: '函数与方程',
    teacher: 'Ms. Zhang',
    attendance: '已出席',
    notes: '课堂表现良好，完成了所有练习'
  },
  {
    id: 102,
    subject: 'PIB 物理',
    date: '2024-07-03',
    time: '15:30-16:30',
    topic: '牛顿运动定律',
    teacher: 'Mr. Li',
    attendance: '已出席',
    notes: '需要复习力学基本概念'
  },
  {
    id: 103,
    subject: 'PIB 英语',
    date: '2024-07-01',
    time: '16:00-17:30',
    topic: '写作技巧',
    teacher: 'Ms. Wilson',
    attendance: '已出席',
    notes: '论文结构有所提高，需要加强词汇运用'
  }
];

export default function StudentDashboard() {
  const [user, setUser] = useState<any>({
    first_name: 'Tim',
    username: 'Tim',
    role: 'student'
  });
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');

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
      // For demo purposes, we're using the mock user instead of redirecting
      // router.push('/');
      // return;
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'student') {
          // router.push('/');
          // return;
        }
        
        // Store user role for component access
        localStorage.setItem('userRole', parsedUser.role);
        
        // setUser(parsedUser);
      } catch (e) {
        // router.push('/');
      }
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation Menu */}
      <nav className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-5 py-3">
          <ul className="flex space-x-6">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-1 text-sm ${activeTab === 'dashboard' ? 'text-black font-medium' : 'text-gray-500'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>仪表盘</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('records')}
                className={`flex items-center space-x-1 text-sm ${activeTab === 'records' ? 'text-black font-medium' : 'text-gray-500'}`}
              >
                <History className="h-4 w-4" />
                <span>课程记录</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* Greeting */}
        <h1 className="text-lg font-normal pt-2">
          {getGreeting()}，<strong>Tim</strong>
        </h1>
        
        {activeTab === 'dashboard' ? (
          <>
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
          </>
        ) : (
          <section>
            <h2 className="text-base font-medium mb-3">历史课程记录</h2>
            <div className="space-y-3">
              {pastClasses.map(cls => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{cls.subject}</div>
                      <div className="text-sm text-gray-500 mt-1">{cls.topic}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{cls.date}</div>
                      <div className="text-sm text-gray-500">{cls.time}</div>
                    </div>
                  </div>
                  <div className="text-sm border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">老师: {cls.teacher}</span>
                      <span className="text-green-600">{cls.attendance}</span>
                    </div>
                    <div className="text-gray-500 mt-1">笔记: {cls.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Logout at bottom */}
        <section className="mt-8 text-center">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-1 text-sm text-gray-500 hover:text-black mx-auto"
          >
            <LogOut className="h-4 w-4" />
            <span>退出登录</span>
          </button>
        </section>
      </main>
    </div>
  );
} 