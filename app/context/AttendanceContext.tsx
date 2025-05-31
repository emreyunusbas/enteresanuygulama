import React, { createContext, useState, useContext } from 'react';

type Attendance = {
  classId: number;
  studentId: number;
  studentCheckedIn: boolean;
  instructorApproved: boolean;
  timestamp: string;
};

type AttendanceContextType = {
  attendance: Attendance[];
  addAttendance: (attendance: Attendance) => void;
  approveAttendance: (classId: number, studentId: number) => void;
  getClassAttendance: (classId: number) => Attendance[];
};

export const AttendanceContext = createContext<AttendanceContextType>({
  attendance: [],
  addAttendance: () => {},
  approveAttendance: () => {},
  getClassAttendance: () => [],
});

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const addAttendance = (newAttendance: Attendance) => {
    setAttendance(prev => [...prev, newAttendance]);
  };

  const approveAttendance = (classId: number, studentId: number) => {
    setAttendance(prev =>
      prev.map(att =>
        att.classId === classId && att.studentId === studentId
          ? { ...att, instructorApproved: true }
          : att
      )
    );
  };

  const getClassAttendance = (classId: number) => {
    return attendance.filter(att => att.classId === classId);
  };

  return (
    <AttendanceContext.Provider
      value={{ attendance, addAttendance, approveAttendance, getClassAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}