import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  totalClasses: number;
  attendedClasses: number;
  activePackage: string;
  classHistory: Array<{
    date: string;
    className: string;
    instructor: string;
    time: string;
    attended: boolean;
    price: number;
  }>;
  payments: Array<{
    id: number;
    date: string;
    amount: number;
    method: 'creditCard' | 'bankTransfer' | 'cash';
    description: string;
  }>;
  classOccupancy: Array<{
    name: string;
    rate: number;
  }>;
};

export type Instructor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  totalClasses: number;
  metrics: {
    weekly: {
      classes: number;
      attendance: number;
      revenue: number;
      studentSatisfaction: number;
    };
    monthly: {
      classes: number;
      attendance: number;
      revenue: number;
      studentSatisfaction: number;
    };
  };
  students: Array<{
    id: number;
    name: string;
    attendance: Array<{
      date: string;
      className: string;
      attended: boolean;
    }>;
    performance: {
      attendanceRate: number;
      improvement: number;
      totalClasses: number;
    };
  }>;
};

export type Class = {
  id: number;
  name: string;
  instructor: string;
  time: string;
  date: string;
  capacity: number;
  enrolled: number;
  price: number;
  studentsAssigned: number[];
};

type DataContextType = {
  students: Student[];
  instructors: Instructor[];
  classes: Class[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: number, student: Partial<Student>) => void;
  deleteStudent: (id: number) => void;
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: number, instructor: Partial<Instructor>) => void;
  deleteInstructor: (id: number) => void;
  addClass: (classData: Omit<Class, 'id'>) => void;
  updateClass: (id: number, classData: Partial<Class>) => void;
  deleteClass: (id: number) => void;
  getStudentById: (id: number) => Student | undefined;
  getInstructorById: (id: number) => Instructor | undefined;
  getClassById: (id: number) => Class | undefined;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialStudents: Student[] = [
  {
    id: 3,
    name: 'Zeynep Kaya',
    email: 'zeynep@email.com',
    phone: '0534 555 1234',
    startDate: '2025-01-15',
    totalClasses: 48,
    attendedClasses: 45,
    activePackage: 'Aylık Sınırsız',
    classHistory: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true,
        price: 150
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: true,
        price: 120
      },
      {
        date: '2025-05-24',
        className: 'Pilates İleri',
        instructor: 'Ayşe Yılmaz',
        time: '18:00',
        attended: false,
        price: 180
      }
    ],
    payments: [
      {
        id: 1,
        date: '2025-05-20',
        amount: 450,
        method: 'creditCard',
        description: 'Mayıs Ayı 3 Ders Paketi'
      },
      {
        id: 2,
        date: '2025-04-15',
        amount: 600,
        method: 'bankTransfer',
        description: 'Nisan Ayı 4 Ders Paketi'
      }
    ],
    classOccupancy: [
      { name: 'Temel Pilates', rate: 85 },
      { name: 'İleri Pilates', rate: 78 },
      { name: 'Yoga', rate: 82 },
      { name: 'Özel Ders', rate: 95 }
    ]
  },
  {
    id: 4,
    name: 'Ali Özkan',
    email: 'ali@email.com',
    phone: '0535 444 5678',
    startDate: '2025-02-01',
    totalClasses: 24,
    attendedClasses: 20,
    activePackage: '10 Ders Paketi',
    classHistory: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true,
        price: 150
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: false,
        price: 120
      }
    ],
    payments: [
      {
        id: 1,
        date: '2025-05-20',
        amount: 300,
        method: 'creditCard',
        description: 'Mayıs Ayı 2 Ders Paketi'
      }
    ],
    classOccupancy: [
      { name: 'Temel Pilates', rate: 82 },
      { name: 'Yoga', rate: 75 },
      { name: 'Özel Ders', rate: 90 }
    ]
  }
];

const initialInstructors: Instructor[] = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    email: 'ayse@studio.com',
    phone: '0532 123 4567',
    specialties: ['Pilates', 'Yoga'],
    rating: 4.8,
    totalClasses: 245,
    metrics: {
      weekly: {
        classes: 24,
        attendance: 92,
        revenue: 20000,
        studentSatisfaction: 4.8
      },
      monthly: {
        classes: 96,
        attendance: 89,
        revenue: 78000,
        studentSatisfaction: 4.7
      }
    },
    students: [
      {
        id: 3,
        name: 'Zeynep Kaya',
        attendance: [
          { date: '2025-05-26', className: 'Pilates Temel', attended: true },
          { date: '2025-05-24', className: 'Pilates İleri', attended: false }
        ],
        performance: {
          attendanceRate: 75,
          improvement: 8,
          totalClasses: 4
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet@studio.com',
    phone: '0533 987 6543',
    specialties: ['Yoga', 'Meditasyon'],
    rating: 4.6,
    totalClasses: 189,
    metrics: {
      weekly: {
        classes: 20,
        attendance: 88,
        revenue: 16500,
        studentSatisfaction: 4.6
      },
      monthly: {
        classes: 82,
        attendance: 87,
        revenue: 65000,
        studentSatisfaction: 4.5
      }
    },
    students: [
      {
        id: 5,
        name: 'Fatma Şahin',
        attendance: [
          { date: '2025-05-25', className: 'Yoga Flow', attended: true }
        ],
        performance: {
          attendanceRate: 100,
          improvement: 10,
          totalClasses: 3
        }
      }
    ]
  }
];

const initialClasses: Class[] = [
  {
    id: 1,
    name: 'Pilates Temel',
    instructor: 'Ayşe Yılmaz',
    time: '09:00',
    date: '2025-05-26',
    capacity: 5,
    enrolled: 4,
    price: 150,
    studentsAssigned: [3, 4, 5, 6]
  },
  {
    id: 2,
    name: 'Yoga Flow',
    instructor: 'Mehmet Demir',
    time: '10:30',
    date: '2025-05-26',
    capacity: 5,
    enrolled: 5,
    price: 120,
    studentsAssigned: [3, 4, 7, 8, 9]
  },
  {
    id: 3,
    name: 'Pilates İleri',
    instructor: 'Ayşe Yılmaz',
    time: '18:00',
    date: '2025-05-26',
    capacity: 5,
    enrolled: 3,
    price: 180,
    studentsAssigned: [3, 10, 11]
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [classes, setClasses] = useState<Class[]>(initialClasses);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newId = Math.max(...students.map(s => s.id), 0) + 1;
    setStudents(prev => [...prev, { ...student, id: newId }]);
  };

  const updateStudent = (id: number, studentUpdate: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...studentUpdate } : student
    ));
  };

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addInstructor = (instructor: Omit<Instructor, 'id'>) => {
    const newId = Math.max(...instructors.map(i => i.id), 0) + 1;
    setInstructors(prev => [...prev, { ...instructor, id: newId }]);
  };

  const updateInstructor = (id: number, instructorUpdate: Partial<Instructor>) => {
    setInstructors(prev => prev.map(instructor => 
      instructor.id === id ? { ...instructor, ...instructorUpdate } : instructor
    ));
  };

  const deleteInstructor = (id: number) => {
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
  };

  const addClass = (classData: Omit<Class, 'id'>) => {
    const newId = Math.max(...classes.map(c => c.id), 0) + 1;
    setClasses(prev => [...prev, { ...classData, id: newId }]);
  };

  const updateClass = (id: number, classUpdate: Partial<Class>) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id ? { ...cls, ...classUpdate } : cls
    ));
  };

  const deleteClass = (id: number) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  const getStudentById = (id: number) => {
    return students.find(student => student.id === id);
  };

  const getInstructorById = (id: number) => {
    return instructors.find(instructor => instructor.id === id);
  };

  const getClassById = (id: number) => {
    return classes.find(cls => cls.id === id);
  };

  return (
    <DataContext.Provider value={{
      students,
      instructors,
      classes,
      addStudent,
      updateStudent,
      deleteStudent,
      addInstructor,
      updateInstructor,
      deleteInstructor,
      addClass,
      updateClass,
      deleteClass,
      getStudentById,
      getInstructorById,
      getClassById
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}