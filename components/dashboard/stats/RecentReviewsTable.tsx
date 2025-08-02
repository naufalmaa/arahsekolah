import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Disesuaikan untuk menerima berbagai jenis ulasan
interface ReviewItem {
  id: number;
  komentar: string;
  createdAt: string;
  user?: { name: string | null };
  school?: { name: string };
  schoolId?: number;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
}

interface RecentReviewsTableProps {
  reviews: ReviewItem[];
  title: string;
  description: string;
  loading?: boolean;
}

const calculateAverageRating = (review: ReviewItem) => {
    const total = review.kenyamanan + review.pembelajaran + review.fasilitas + review.kepemimpinan;
    return (total / 4).toFixed(1);
};


export const RecentReviewsTable = ({ reviews, title, description, loading }: RecentReviewsTableProps) => {
    if (loading) {
        return <Skeleton className="h-[350px] w-full" />;
    }

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-600">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pengguna/Sekolah</TableHead>
                            <TableHead className="hidden sm:table-cell">Komentar</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                            <TableHead className="text-right">Tanggal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length > 0 ? reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-800">{review.user?.name || 'Pengguna'}</div>
                                    <div className="text-sm text-slate-500">{review.school?.name || 'Ulasan Anda'}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell max-w-sm truncate">
                                    {review.komentar}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary">{calculateAverageRating(review)} ★</Badge>
                                </TableCell>
                                <TableCell className="text-right text-slate-500">
                                    {format(new Date(review.createdAt), 'dd MMM yyyy')}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                    Tidak ada ulasan ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};