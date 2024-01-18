import { Ifile } from './Ifile';
import RNFS from './web/react-native-fs';


export const file: Ifile & typeof RNFS = RNFS as any

file.mainPath = () => {
    return ""
}