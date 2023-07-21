import FormData from 'form-data';
import * as fs from 'fs';

const themeObject = {
  mode: 'dark',
  rgb: {
    primary: '40, 210, 199',
    secondary: '210, 176, 40',
  },
};
const formData = new FormData();
formData.append('theme', JSON.stringify(themeObject));
formData.append('serviceLogo', fs.createReadStream('./miladystationlogo.png'));
// await axios.post(
//   'https://api.bancof.io/pool/customTdheme/MONY GROUP LENDING',
//   formData,
//   {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   },
// );

console.log(formData);
console.log('hello');
