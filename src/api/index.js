import axios from "axios/index";

const index = axios.create({
    baseURL: 'https://api.backendless.com/948FE494-CBB7-8015-FF6A-F62A9870BE00/10436E49-F445-C957-FFBC-85477448F400',
    responseType: 'json'
});

export function createMemo(memo) {
    return index.post('/data/memo', memo);
}

export function uploadPhoto(imageUri) {
    const imageName = Math.random().toString(36).substring(7);

    const formData = new FormData();
    formData.append('photo', {
        uri: imageUri,
        name: imageName,
        type: 'image/jpg'
    });

    const config = {
        headers: {'content-type': 'multipart/form-data'}
    };

    return index.post(`/files/memo_images/${imageName}`, formData, config);
}

export default index;

