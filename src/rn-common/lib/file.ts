import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { Ifile } from './Ifile';


export const file: typeof RNFS & Ifile = RNFS as any;

file.mainPath = () => {
    if (Platform.OS === "android")
        return RNFS.DocumentDirectoryPath;

    // if (RNFS.ExternalDirectoryPath)
    // return RNFS.ExternalDirectoryPath;
    if (RNFS.MainBundlePath)
        return RNFS.MainBundlePath;
    return ""
}


