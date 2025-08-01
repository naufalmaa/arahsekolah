// File: components/dashboard/ReviewList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./ReviewForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image"; 

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchReviewsBySchoolId, deleteReviewAsync, ReviewWithUser } from "@/redux/reviewSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewListProps {
  schoolId: number;
}

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return parts[0][0];
};

const ReviewList = ({ schoolId }: ReviewListProps) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [currentEditingReview, setCurrentEditingReview] =
    useState<ReviewWithUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.review);

  const { data: session } = useSession();
  // const router = useRouter();

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  // const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    dispatch(fetchReviewsBySchoolId(schoolId));
  }, [dispatch, schoolId]);

  const handleReviewAddedOrUpdated = () => {
    setIsAddReviewModalOpen(false);
    setCurrentEditingReview(null);
    dispatch(fetchReviewsBySchoolId(schoolId));
  };

  const handleCancelAddReview = () => {
    setIsAddReviewModalOpen(false);
  };

  const handleEditReviewClick = (review: ReviewWithUser) => {
    setCurrentEditingReview(review);
    setIsEditReviewModalOpen(true);
  };

  const handleDeleteReview = (reviewId: number) => {
    dispatch(deleteReviewAsync(reviewId))
      .unwrap()
      .then(() => {
        toast.success("Review deleted successfully!");
        setIsDeleteDialogOpen(false);
        setReviewToDelete(null);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // const renderStarRating = (rating: number) => {
  //   return (
  //     <div className="flex items-center space-x-1 text-yellow-400">
  //       {[...Array(5)].map((_, i) => (
  //         <StarFilledIcon
  //           key={i}
  //           className={i < rating ? "text-yellow-400" : "text-slate-300"}
  //         />
  //       ))}
  //     </div>
  //   );
  // };

  const renderSkeletons = () => (
    <div className="space-y-6 mt-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-lg">
          <CardHeader className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return renderSkeletons();
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8 bg-red-50 border-red-200 rounded-2xl">
        <AlertTitle className="text-red-800">Error</AlertTitle>
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    );
  }

  const canAddReview = userRole === "USER";
  const canEditOrDelete = (reviewUserId: string) =>
    userId === reviewUserId || userRole === "SCHOOL_ADMIN";

  const hasUserReviewed = reviews.some((review) => review.userId === userId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center px-5 py-3 rounded-full text-sm font-medium bg-slate-200 text-slate-700 mb-2">
            ⭐ {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
          </div>
        </div>
        {/* {canAddReview &&  ( */}
        {canAddReview && !hasUserReviewed && (
          <Dialog
            open={isAddReviewModalOpen}
            onOpenChange={setIsAddReviewModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center">
                  Add Your Review
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-0 rounded-3xl">
              <DialogHeader className="p-6 pb-6 border-b border-slate-200">
                <DialogTitle className="text-3xl font-bold text-slate-900">
                  Add Your Review
                </DialogTitle>
                <DialogDescription className="text-slate-600 text-lg">
                  Share your experience and help others learn about this school.
                </DialogDescription>
              </DialogHeader>
              <ReviewForm
                schoolId={Number(schoolId)}
                onReviewSubmitted={handleReviewAddedOrUpdated}
                onCancel={handleCancelAddReview}
                userName={userName || ''}
                userImage={userImage || ''}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-slate-200 max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Reviews Yet</h3>
            <p className="text-slate-600 leading-relaxed">
              Be the first to share your experience about this school and help other parents make informed decisions.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mt-6">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 gap-4">
                    {review.user?.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-200">
                        <Image
                          src={review.user.image}
                          alt={review.user.name || "User"}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 text-slate-700 font-bold text-lg ring-2 ring-slate-200">
                        {getInitials(review.name || review.user?.name || "?")}
                      </div>
                    )}
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                        {review.name || review.user?.name || "Anonymous"}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 font-medium">
                        {review.role}
                      </CardDescription>
                      <div className="flex items-center text-xs text-slate-500">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>{format(new Date(review.createdAt), "PPP")}</span>
                      </div>
                    </div>
                  </div>
                  
                  {canEditOrDelete(review.userId) && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReviewClick(review)}
                        className="text-slate-600 hover:bg-slate-100 border-slate-300 rounded-xl px-4 py-2 transition-all duration-200 mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setReviewToDelete(review.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 rounded-xl px-4 py-2 transition-all duration-200"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 mb-4">
                    <p className="text-l font-medium text-slate-600 mb-2">
                    Cost Information
                    </p>
                    <p className="text-slate-800 font-semibold">{review.biaya}</p>
                  </div>
                  
                  <div>
                    <p className="text-base text-slate-800 leading-relaxed bg-slate-50/50 rounded-2xl p-4 border border-slate-200">
                    <strong className="text-l font-medium text-slate-600 block mb-3">Comment</strong>

                      {review.komentar}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-slate-200">
                    <div className="text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarFilledIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.kenyamanan ? "text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">COMFORTABILITY</p>
                      <p className="text-lg font-bold text-slate-900">{review.kenyamanan}/5</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarFilledIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.pembelajaran ? "text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">LEARNING QUALITY</p>
                      <p className="text-lg font-bold text-slate-900">{review.pembelajaran}/5</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarFilledIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.fasilitas ? "text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">FACILITIES</p>
                      <p className="text-lg font-bold text-slate-900">{review.fasilitas}/5</p>
                    </div>
                    
                    <div className="text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarFilledIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.kepemimpinan ? "text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">LEADERSHIP & MANAGEMENT</p>
                      <p className="text-lg font-bold text-slate-900">{review.kepemimpinan}/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {currentEditingReview && (
        <Dialog
          open={isEditReviewModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCurrentEditingReview(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[700px] p-0 rounded-3xl">
              <DialogHeader className="p-6 pb-6 border-b border-slate-200">
                <DialogTitle className="text-3xl font-bold text-slate-900">
                Edit Your Review
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-lg">
                Make changes to your existing review.
              </DialogDescription>
            </DialogHeader>
            <ReviewForm
              schoolId={Number(schoolId)}
              onReviewSubmitted={handleReviewAddedOrUpdated}
              onCancel={() => setCurrentEditingReview(null)}
              currentReview={currentEditingReview}
              userName={userName || ''}
              userImage={userImage || ''}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-slate-600 text-base">
              This action cannot be undone. This will permanently delete your review and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl px-6 py-2 mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (reviewToDelete !== null) {
                  handleDeleteReview(reviewToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600 rounded-xl px-6 py-2"
            >
              Delete Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewList;