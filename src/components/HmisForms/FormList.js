import BasicInfo from './BasicInfo';
import FinancialInfo from './FinancialInfo';
import HousingInfo from './HousingInfo';

const HMIS_FORM_LIST = [
  { path: 'basic_info', label: 'Basic Information', element: BasicInfo, key: 'basic_info' },
  { path: 'housing_info', label: 'Housing Information', element: HousingInfo, key: 'housing_info' },
  {
    path: 'financial_info',
    label: 'Financial Information',
    element: FinancialInfo,
    key: 'financial_info'
  }
];

export default HMIS_FORM_LIST;
