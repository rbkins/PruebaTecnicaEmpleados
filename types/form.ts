export interface SelectOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  minLength?: number;
  isSelect?: boolean;
  options: SelectOption[];
  validations: {
    required: boolean;
    minLength?: number;
  };
}

export interface FormConfig {
  fields: Field[];
}
