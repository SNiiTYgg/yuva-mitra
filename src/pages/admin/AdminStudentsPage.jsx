import React, { useState } from 'react';
import { GraduationCap, Sparkles, CheckCircle2, Search, Mail, Building2 } from 'lucide-react';
import { INITIAL_STUDENT } from '../../data/initialMockData';
import { Card, CardHeader } from '../../components/common/Card';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { SkillBadge } from '../../components/common/SkillBadge';

export function AdminStudentsPage() {
  const [search, setSearch] = useState('');

  const mockStudents = [
    INITIAL_STUDENT,
    {
      id: 'stu-102',
      name: 'Priya Nambiar',
      email: 'priya.nambiar@nitc.ac.in',
      college: 'National Institute of Technology Calicut (NIT Calicut)',
      course: 'B.Tech - Information Technology',
      yearOfStudy: '4th Year',
      cgpa: '9.10 / 10.0',
      overallSkillMatchScore: 89,
      status: 'active',
      joinedDate: '2025-10-15',
      strongSkills: ['React.js', 'Node.js', 'Tailwind CSS', 'Figma'],
    },
    {
      id: 'stu-103',
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@coep.ac.in',
      college: 'COEP Technological University, Pune',
      course: 'B.Tech - Computer Science',
      yearOfStudy: '3rd Year',
      cgpa: '8.65 / 10.0',
      overallSkillMatchScore: 84,
      status: 'active',
      joinedDate: '2025-11-20',
      strongSkills: ['Python', 'C++', 'SQL', 'Docker'],
    },
    {
      id: 'stu-104',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@bits-pilani.ac.in',
      college: 'BITS Pilani (Goa Campus)',
      course: 'B.E. Electronics & Communication',
      yearOfStudy: '4th Year',
      cgpa: '9.35 / 10.0',
      overallSkillMatchScore: 94,
      status: 'active',
      joinedDate: '2025-09-05',
      strongSkills: ['Embedded Systems', 'Python', 'VLSI', 'IoT'],
    }
  ];

  const filtered = mockStudents.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.college.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            National Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Verified student talent database across IITs, NITs, State Universities, and Autonomous Institutions
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, college, or degree program..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Table */}
      <Card padding="p-0" className="overflow-hidden shadow-md">
        <Table headers={['Student Name', 'Institution & Degree', 'CGPA', 'Skill Match Score', 'Verified Skills', 'Status']}>
          {filtered.map((stu) => (
            <TableRow key={stu.id}>
              <TableCell>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {stu.name}
                  </span>
                  <span className="text-xs text-slate-400 block">{stu.email}</span>
                </div>
              </TableCell>

              <TableCell>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block truncate max-w-[200px]">
                  {stu.college}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {stu.course} ({stu.yearOfStudy})
                </span>
              </TableCell>

              <TableCell className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                {stu.cgpa}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs w-fit">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{stu.overallSkillMatchScore}%</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {(stu.strongSkills || []).slice(0, 2).map((sk, i) => (
                    <SkillBadge key={i} name={typeof sk === 'string' ? sk : sk.name} size="sm" />
                  ))}
                  {(stu.strongSkills || []).length > 2 && (
                    <span className="text-[10px] text-slate-400">
                      +{stu.strongSkills.length - 2} more
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
