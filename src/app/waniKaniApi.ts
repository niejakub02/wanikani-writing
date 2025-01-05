import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Assignment, Subject, WaniKaniResponse } from 'src/types/common';

export const waniKaniApi = createApi({
  reducerPath: 'waniKaniApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.wanikani.com/v2',
    // headers: {
    //   Authorization: 'Bearer 45ece105-1189-4389-82d7-d7a8b91b2c6f',
    // },
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
