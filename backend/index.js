const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const axios=require('axios')

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const activeSessions = new Map();

const createDummyData = (config) => {
    const {
        sessionId,
        faceRecognitionStatus,
        faceDetectionStatus,
        attendanceStatus,
        includeAttendance = false,
        faceLivenessScore = 0,
        faceMatchConfidenceScore = 0
    } = config;

    const baseResponse = {
        face_liveness_result: {
            SessionId: sessionId,
            Status: faceRecognitionStatus,
            Confidence: faceLivenessScore,
            ReferenceImage: {
                Bytes: "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAHgAoADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpaWlpaAG96cKMUuDQAoFLQKKACilFBFACUUYoxQA4UopBSigBaUdaSlFADqcKbThQAop4pi9akxQA9akWoxUi0ASLUi1EDUi0AWFqaPrVdTxUyHmgC5GeauxHpVCM8irkR6UwNFDxT6giPFT0AFFFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKpzHk1bbgVSmPNMCnIetVX61O5qs560AQv1qA1K5qE0gI261Gae3Woz0oAjPWmmnGmmgCI9aaacetIaAGGmE4p5NMNADabTiKQ0ANam9qcabQAw0004000AJTTTqaaAEpDS0lABTO9PpnegANJS0lADcUYpxpuaANCinYoxQACnU0U6gAFFApaAClpKdQAlFFAoAdRRRQAuacKZ3p4oAKcKbThQA4U8UwCnigB608VGKkFAEi1KtQipFoAnTpUyGq6VMvWgC0hq1E3Iqkh5qzGeaANGJuat9qz4mq7G2VFMB9FFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAa/C1nytyauTNxWfK3NMCtIeTVZ6nkPWq7mgCF6iapW6VE1ICJqibpUrVE3SgBhpppxppoAY1RmpGqM0AIajNSGozQAhphp5pjUANNNpxppoAQ02nGm0ANooooASm06m0ANop1FADab3p1N70AJTadTaANOiiigBcUYpaKAFxSim0tADsUuKSlH1oAMUlPprDigBKdTAadkUALSgUlOAoAXFKKSlFADxThSClFACinrTBT1oAeKlSohUi0ATKamWoAalU0AToRVmNsYqmpqdGoAvxt0q9E2RWXG2KtwyYxTAv0UxHyBT6QBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRTHbCmgCGd+tZ8jc1NM5JPNVJDzVAMc1Wc1I5qBjSAY9RGnMajJpAMaozTmphNADDTTSmmGgANMNKaQ0ANNNNPNMNADDTDUhphFADCaaTTzTDQAw5pvNPNJigBlFPxSYoAZRTqMUAMop1FADabTjTaAGmm04im0AaeKAKdRQAUUUUALigCjNKDQAYoozRmgBMml5NFOoAjK4NOCmlZcikU44oAeBS9qTNO7UAKKfimCloAeKUU1acKAHinjpTKcDQA4VItRipFNAEgNSKahBqRTQBOpqVTUCmpFNAFpGqzG/IqijVYRsUwNOKQdKsA5rMjkq3FL60AWaKaGB706kAUUUUAFFFFABRRSZFAC0UZFGRQAUUZFJkUALRSZHrRuHrQAtFJketLmgAopMimNIFFAD2YAVUml96SabPSqcklOwhZX71VkbNOd81XduaBjXNRMac7VCTQAjGom605mqMmkAhpjU41GaAENRmnmmGgBpptONNoAQ0w040w0AIabTjTaAENMNPPSmGgBMUmKdikxQAlNpxptADaKKKAEooooAQ0004000ABplPpnegDRooooAWiiigBaKbRQBJRTaKAFpw6U2nDpQA6k75paKAClFJSigBwpw600U4daAHClFIKUUAO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",
                BoundingBox: {
                    Width: 215.54434204101562,
                    Height: 299.73828125,
                    Left: 196.38671875,
                    Top: 59.2037239074707
                }
            },
            AuditImages: [],
            ResponseMetadata: {
                RequestId: uuidv4(),
                HTTPStatusCode: 200,
                HTTPHeaders: {
                    "x-amzn-requestid": uuidv4(),
                    "content-type": "application/x-amz-json-1.1",
                    "content-length": "26942",
                    "date": new Date().toUTCString()
                },
                RetryAttempts: 0
            }
        },
        face_detection_result: {
            Result: faceDetectionStatus,
            message: faceDetectionStatus === "SUCCEEDED" ? 
                "Matching found" : 
                "Not matching with any Face ID",
            EmployeeId: "DEDOL-0001",
            EmployeeName: "Ramya",
            SearchedFaceConfidence: faceMatchConfidenceScore,
            detection_response: {
                SearchedFaceBoundingBox: {
                    Width: 0.33334168791770935,
                    Height: 0.6264051795005798,
                    Left: 0.3078157305717468,
                    Top: 0.12676429748535156
                },
                FaceMatches: faceDetectionStatus === "SUCCEEDED" ? [
                    {
                        Similarity: faceMatchConfidenceScore,
                        Face: {
                            FaceId: uuidv4(),
                            BoundingBox: {
                                Width: 0.3337930142879486,
                                Height: 0.3392769992351532,
                                Left: 0.34163498878479004,
                                Top: 0.19055600464344025
                            },
                            ImageId: uuidv4(),
                            ExternalImageId: "Ramya",
                            Confidence: faceMatchConfidenceScore,
                            IndexFacesModelVersion: "7.0"
                        }
                    }
                ] : [],
                FaceModelVersion: "7.0",
                ResponseMetadata: {
                    RequestId: uuidv4(),
                    HTTPStatusCode: 200,
                    HTTPHeaders: {
                        "x-amzn-requestid": uuidv4(),
                        "content-type": "application/x-amz-json-1.1",
                        "content-length": "572",
                        "date": new Date().toUTCString()
                    },
                    RetryAttempts: 0
                }
            }
        }
    };

    if (includeAttendance) {
        baseResponse.Attendance_response = {
            statusCode: 200,
            response: {
                Result: attendanceStatus,
                message: attendanceStatus === "SUCCEEDED" ? 
                    "Your attendance Marked" : 
                    "Your attendance Failed",
                attendenceId: Math.floor(Math.random() * 1000),
                date: new Date().toISOString().split('T')[0],
                checkInTime: new Date().toTimeString().split(' ')[0],
                checkOutTime: null
            }
        };
    }

    return baseResponse;
};

app.get('/createfacelivenesssession', (req, res) => {
    const sessionId = uuidv4();
    activeSessions.set(sessionId, { createdAt: new Date() });
    res.json({ statusCode: 200, sessionId });
});

app.get("/api/get-address", async (req, res) => {
    console.log('logging get requst')
    try {
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const response = await axios.get(url);
        console.log(response.data)
        return res.json({ address: response.data.display_name });
    } catch (error) {
        console.log(error)
        console.error("Error fetching address:", error);
        return res.status(500).json({ error: "Failed to fetch address" });
    }
});

const scenarios = {
    1: {
        config: {
            faceRecognitionStatus: "SUCCEEDED",
            faceDetectionStatus: "SUCCEEDED",
            attendanceStatus: "SUCCEEDED",
            includeAttendance: true,
            faceLivenessScore: 95.5,
            faceMatchConfidenceScore: 99.8
        },
        statusCode: 200
    },
    2: {
        config: {
            faceRecognitionStatus: "SUCCEEDED",
            faceDetectionStatus: "SUCCEEDED",
            attendanceStatus: "FAILED",
            includeAttendance: true,
            faceLivenessScore: 92.3,
            faceMatchConfidenceScore: 98.5
        },
        statusCode: 200
    },
    3: {
        config: {
            faceRecognitionStatus: "FAILED",
            faceDetectionStatus: "FAILED",
            includeAttendance: false,
            faceLivenessScore: 45.2,
            faceMatchConfidenceScore: 30.1
        },
        statusCode: 400,
    },
    4: {
        config: {
            faceRecognitionStatus: "SUCCEEDED",
            faceDetectionStatus: "FAILED",
            includeAttendance: false,
            faceLivenessScore: 88.7,
            faceMatchConfidenceScore: 45.3
        },
        statusCode: 400,
    },
    5: {
        config: {
            faceRecognitionStatus: "FAILED",
            faceDetectionStatus: "SUCCEEDED",
            includeAttendance: false,
            faceLivenessScore: 42.8,
            faceMatchConfidenceScore: 97.2
        },
        statusCode: 400,
    }
};

Object.entries(scenarios).forEach(([scenario, details]) => {
    app.post(`/api/scenario${scenario}/getfacelivenesssessionresults`, (req, res) => {
        const { sessionId } = req.body;
        const data = createDummyData({ sessionId, ...details.config });
        res.json({
            statusCode: details.statusCode,
            body: data,
        });
    });
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Mock API Server running at http://localhost:${port}`);
});