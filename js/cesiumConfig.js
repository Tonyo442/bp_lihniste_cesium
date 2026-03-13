const cesiumAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZGZhNzA0YS1jNmEyLTQ4ZmMtYTU2OS1hNGRlMTI3YzVjYmYiLCJpZCI6MzY2Njg2LCJpYXQiOjE3NzMxNDc4MzF9.r1cFVZ_Js7D46zXy-hW7sq9M28aYMz-5dkfQXPVwA9A';

 const targetLocation = {
    destination: Cesium.Cartesian3.fromDegrees(17.135140, 49.6738119, 500),
    orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-15.0),
    }
};

export { cesiumAccessToken, targetLocation};
