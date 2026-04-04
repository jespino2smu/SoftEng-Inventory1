import type {Product} from './Product'

export interface FlexSearchResult {
  field: string;
  result: {
    id: number | string;
    doc: Product;
  }[];
}