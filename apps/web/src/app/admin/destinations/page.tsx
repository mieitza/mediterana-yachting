import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, destinations } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, MapPin } from 'lucide-react';
import { DeleteDestinationButton } from './DeleteDestinationButton';

async function getDestinations() {
  return db.select().from(destinations).orderBy(destinations.name).all();
}

export default async function AdminDestinationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allDestinations = await getDestinations();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Destinations" />

      <div className="flex-1 p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            {allDestinations.length} destination{allDestinations.length !== 1 ? 's' : ''} total
          </p>
          <Link href="/admin/destinations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
          </Link>
        </div>

        {/* Destinations Table */}
        {allDestinations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No destinations yet
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by adding your first destination.
            </p>
            <Link href="/admin/destinations/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Destination
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Best Season
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Highlights
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allDestinations.map((destination) => {
                  const heroImage = destination.heroImage ? JSON.parse(destination.heroImage) : null;
                  const highlights = destination.highlights ? JSON.parse(destination.highlights) : [];

                  return (
                    <tr key={destination.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {heroImage?.url ? (
                            <img
                              src={heroImage.url}
                              alt={heroImage.alt || destination.name}
                              className="h-12 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-16 bg-slate-200 rounded flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-slate-900">
                              {destination.name}
                            </span>
                            <p className="text-sm text-slate-500">
                              /{destination.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700">
                          {destination.bestSeason || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {highlights.slice(0, 3).map((highlight: string, i: number) => (
                            <span
                              key={i}
                              className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                          {highlights.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/destinations/${destination.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteDestinationButton id={destination.id} name={destination.name} />
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
