"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTrends = void 0;
var genai_1 = require("@google/genai");
var ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
// Schema for the second step (Formatting)
var trendSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        trends: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    name: { type: genai_1.Type.STRING, description: "Name of the trend" },
                    description: { type: genai_1.Type.STRING, description: "Brief description of the trend" },
                    growthScore: { type: genai_1.Type.INTEGER, description: "Predicted growth score from 0 to 100" },
                    sentiment: { type: genai_1.Type.STRING, description: "General sentiment: Positive, Neutral, or Mixed" },
                    prediction: { type: genai_1.Type.STRING, description: "Future outlook for this trend over the next 6-12 months" },
                    marketStrategy: { type: genai_1.Type.STRING, description: "Actionable marketing strategy for brands targeting Gen Z" },
                    productIdea: { type: genai_1.Type.STRING, description: "A specific product development concept leveraging this trend" },
                    historicalData: {
                        type: genai_1.Type.ARRAY,
                        description: "Simulated trend data points for the last 6 months for visualization",
                        items: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                month: { type: genai_1.Type.STRING },
                                value: { type: genai_1.Type.INTEGER },
                            }
                        }
                    }
                },
                required: ["name", "description", "growthScore", "sentiment", "prediction", "marketStrategy", "productIdea", "historicalData"],
            },
        },
    },
    required: ["trends"],
};
var fetchTrends = function (category) { return __awaiter(void 0, void 0, void 0, function () {
    var searchPrompt, searchResponse, searchData, groundingChunks, validSources_1, analysisPrompt, structuredResponse, jsonText, parsed, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                searchPrompt = "\n      Act as a cool trend spotter for Gen Z.\n      Search for the absolute latest, rising trends in ".concat(category, " for Gen Z right now (current year).\n      Focus on viral aesthetics, emerging technologies, or lifestyle shifts.\n      Look for specific items, styles, or behaviors that are gaining traction on TikTok, Instagram, or niche communities.\n      Provide a detailed report.\n    ");
                return [4 /*yield*/, ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        config: {
                            tools: [{ googleSearch: {} }],
                        },
                        contents: searchPrompt,
                    })];
            case 1:
                searchResponse = _d.sent();
                searchData = searchResponse.text;
                groundingChunks = ((_c = (_b = (_a = searchResponse.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.groundingMetadata) === null || _c === void 0 ? void 0 : _c.groundingChunks) || [];
                validSources_1 = groundingChunks
                    .map(function (chunk) { return chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null; })
                    .filter(function (s) { return s !== null; });
                analysisPrompt = "\n      Analyze the following trend report on Gen Z ".concat(category, ":\n      \n      \"").concat(searchData, "\"\n\n      Extract the top 4 distinct trends from this text.\n      For each trend, predict its future trajectory, suggest a market strategy, and a product idea.\n      Generate a simulated historical data array (last 6 months) showing its rise (values 0-100).\n      Return ONLY JSON.\n    ");
                return [4 /*yield*/, ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: analysisPrompt,
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: trendSchema,
                        },
                    })];
            case 2:
                structuredResponse = _d.sent();
                jsonText = structuredResponse.text;
                if (!jsonText)
                    throw new Error("Failed to generate JSON");
                parsed = JSON.parse(jsonText);
                // Merge sources back (distribute them roughly or just attach global sources to the first item? 
                // Let's attach relevant sources if possible, but for simplicity, we'll attach the top 3 global sources to all for reference, 
                // or leave it to the UI to show "Global Sources").
                // Here we will just assign a unique ID and return.
                return [2 /*return*/, parsed.trends.map(function (t, index) { return (__assign(__assign({}, t), { id: "".concat(category, "-").concat(index, "-").concat(Date.now()), category: category, sources: validSources_1.slice(0, 3) })); })];
            case 3:
                error_1 = _d.sent();
                console.error("Error fetching trends:", error_1);
                // Return empty or mock in case of critical failure to avoid white screen, but ideally we show error state in UI
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchTrends = fetchTrends;
