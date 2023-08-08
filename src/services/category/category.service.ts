import { CategoriesResponse } from './category.dto';
import axiosInstance from '@/utils/axiosConfig';

export const getAllPitchCategories = async () => {
  const { data } = await axiosInstance.get<CategoriesResponse>('/pitch-categories');

  return data;
};
