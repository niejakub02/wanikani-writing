import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Assignment, Subject, WaniKaniResponse } from 'src/types/common';
import { shuffle } from 'lodash';

export const waniKaniApi = createApi({
  reducerPath: 'waniKaniApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.wanikani.com/v2',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('waniKaniAccessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    },
  }),
  endpoints: (builder) => ({
    reviewSubjects: builder.query<
      WaniKaniResponse<WaniKaniResponse<Assignment>[]>,
      void
    >({
      query: () => ({
        url: 'assignments',
        method: 'GET',
        params: {
          immediately_available_for_review: true,
          subject_types: 'kanji', // will be extended to vocab later on
        },
      }),
      transformResponse: (
        response: WaniKaniResponse<WaniKaniResponse<Assignment>[]>
      ) => {
        const shouldShuffleReview =
          localStorage.getItem('shouldShuffleReview') === 'true';
        response.data = shouldShuffleReview
          ? shuffle(response.data)
          : response.data;
        // response.data = response.data.filter((_, i) => i < 3); // remove later on
        return response;
      },
    }),
    subject: builder.query<WaniKaniResponse<Subject>, number>({
      query: (id) => ({
        url: `subjects/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useReviewSubjectsQuery, useSubjectQuery } = waniKaniApi;
