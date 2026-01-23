import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, yachts } from '@/lib/db';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Ship, Star } from 'lucide-react';
import { DeleteYachtButton } from './DeleteYachtButton';

async function getYachts() {
  return db.select().from(yachts).orderBy(desc(yachts.featured), yachts.name).all();
}

export default async function AdminYachtsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allYachts = await getYachts();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Yachts" />

      <div className="flex-1 p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            {allYachts.length} yacht{allYachts.length !== 1 ? 's' : ''} total
          </p>
          <Link href="/admin/yachts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Yacht
            </Button>
          </Link>
        </div>

        {/* Yachts Table */}
        {allYachts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Ship className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No yachts yet
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by adding your first yacht.
            </p>
            <Link href="/admin/yachts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Yacht
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Yacht
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Specs
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Price
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allYachts.map((yacht) => {
                  const heroImage = yacht.heroImage ? JSON.parse(yacht.heroImage) : null;

                  return (
                    <tr key={yacht.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {heroImage?.url ? (
                            <img
                              src={heroImage.url}
                              alt={heroImage.alt || yacht.name}
                              className="h-12 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-16 bg-slate-200 rounded flex items-center justify-center">
                              <Ship className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">
                                {yacht.name}
                              </span>
                              {yacht.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <span className="text-sm text-slate-500">
                              /{yacht.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-700">
                          {yacht.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          {yacht.length && <span>{yacht.length}</span>}
                          {yacht.guests && (
                            <span className="ml-2">• {yacht.guests} guests</span>
                          )}
                          {yacht.cabins && (
                            <span className="ml-2">• {yacht.cabins} cabins</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {yacht.fromPrice ? (
                          <span className="text-slate-700">
                            From €{yacht.fromPrice.toLocaleString()}/week
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/yachts/${yacht.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteYachtButton id={yacht.id} name={yacht.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
