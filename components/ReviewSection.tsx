'use client';

import { useState } from "react";

type Review = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  isFake: boolean;
  helpful: number;
};

type Props = {
  reviews: Review[];
};

export default function ReviewSection({ reviews }: Props) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const fakeReviews = reviews.filter(r => r.isFake).length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Guest Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-slate-800">{averageRating}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.round(parseFloat(averageRating)) ? 'fill-current' : 'fill-slate-300'}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="text-slate-600">({totalReviews} reviews)</span>
            {fakeReviews > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                ⚠️ {fakeReviews} suspicious review{fakeReviews > 1 ? 's' : ''} detected
              </span>
            )}
          </div>
        </div>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div 
            key={review.id} 
            className={`card relative ${review.isFake ? 'border-2 border-red-200 bg-red-50/30' : ''}`}
          >
            {review.isFake && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Suspicious Review Detected
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {review.userAvatar}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-slate-300'}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <p className={`text-slate-700 leading-relaxed ${review.isFake ? 'text-red-800' : ''}`}>
                  {review.comment}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <button className="text-sm text-slate-600 hover:text-primary flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
