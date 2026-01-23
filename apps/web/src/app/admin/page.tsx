import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, yachts, destinations, posts, teamMembers, inquiries } from '@/lib/db';
import { count, eq } from 'drizzle-orm';
import { Ship, MapPin, FileText, Users, Mail, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const [
    yachtCount,
    destinationCount,
    postCount,
    teamCount,
    newInquiryCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(yachts).get(),
    db.select({ count: count() }).from(destinations).get(),
    db.select({ count: count() }).from(posts).get(),
    db.select({ count: count() }).from(teamMembers).get(),
    db.select({ count: count() }).from(inquiries).where(eq(inquiries.status, 'new')).get(),
  ]);

  return {
    yachts: yachtCount?.count || 0,
    destinations: destinationCount?.count || 0,
    posts: postCount?.count || 0,
    team: teamCount?.count || 0,
    newInquiries: newInquiryCount?.count || 0,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  const statCards = [
    {
      name: 'Yachts',
      value: stats.yachts,
      icon: Ship,
      href: '/admin/yachts',
      color: 'bg-blue-500',
    },
    {
      name: 'Destinations',
      value: stats.destinations,
      icon: MapPin,
      href: '/admin/destinations',
      color: 'bg-green-500',
    },
    {
      name: 'Blog Posts',
      value: stats.posts,
      icon: FileText,
      href: '/admin/posts',
      color: 'bg-purple-500',
    },
    {
      name: 'Team Members',
      value: stats.team,
      icon: Users,
      href: '/admin/team',
      color: 'bg-orange-500',
    },
    {
      name: 'New Inquiries',
      value: stats.newInquiries,
      icon: Mail,
      href: '/admin/inquiries',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Dashboard" />

      <div className="flex-1 p-6">
        {/* Welcome message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome back, {session.user.name || 'Admin'}
          </h2>
          <p className="text-slate-600 mt-1">
            Here&apos;s an overview of your yacht charter website.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600">{stat.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/yachts/new"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Ship className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Add New Yacht</span>
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Write Blog Post</span>
            </Link>
            <Link
              href="/admin/pages/home"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="font-medium">Edit Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
