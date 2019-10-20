import getMedSup from './model-helpers/medications_supplements';

const getMedSupLoader = async keys =>
    new Promise(async (resolve ) => {
        const medSupArray = [];
        for(let j = 0; j < keys.length; j++){
            medSupArray.push(await getMedSup(keys[j]));
        }
        resolve(medSupArray);
    });

export default getMedSupLoader;
