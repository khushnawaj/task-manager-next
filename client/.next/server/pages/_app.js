/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ \"react-redux\");\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store */ \"./store/index.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-hot-toast */ \"react-hot-toast\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_store__WEBPACK_IMPORTED_MODULE_3__, react_hot_toast__WEBPACK_IMPORTED_MODULE_5__]);\n([_store__WEBPACK_IMPORTED_MODULE_3__, react_hot_toast__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    // Ensure store is stable across renders\n    const stableStore = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(()=>_store__WEBPACK_IMPORTED_MODULE_3__[\"default\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_redux__WEBPACK_IMPORTED_MODULE_2__.Provider, {\n        store: stableStore,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_4___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"TaskMaster | Enterprise Task Management\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                        lineNumber: 15,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1, maximum-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                        lineNumber: 16,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_hot_toast__WEBPACK_IMPORTED_MODULE_5__.Toaster, {\n                position: \"bottom-right\",\n                toastOptions: {\n                    className: \"text-sm font-medium\",\n                    duration: 3000,\n                    style: {\n                        background: \"#333\",\n                        color: \"#fff\",\n                        borderRadius: \"8px\"\n                    },\n                    success: {\n                        iconTheme: {\n                            primary: \"#4f46e5\",\n                            secondary: \"#fff\"\n                        }\n                    },\n                    error: {\n                        iconTheme: {\n                            primary: \"#ef4444\",\n                            secondary: \"#fff\"\n                        }\n                    }\n                }\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                lineNumber: 18,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"min-h-screen bg-brand-50/50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                    lineNumber: 43,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n                lineNumber: 42,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\asus\\\\Downloads\\\\taskmanager_full\\\\client\\\\pages\\\\_app.js\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBQ1E7QUFDVjtBQUNBO0FBQ2E7QUFDVjtBQUVqQixTQUFTSyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2xELHdDQUF3QztJQUN4QyxNQUFNQyxjQUFjSiw4Q0FBT0EsQ0FBQyxJQUFNSCw4Q0FBS0EsRUFBRSxFQUFFO0lBRTNDLHFCQUNFLDhEQUFDRCxpREFBUUE7UUFBQ0MsT0FBT087OzBCQUNmLDhEQUFDTixrREFBSUE7O2tDQUNILDhEQUFDTztrQ0FBTTs7Ozs7O2tDQUNQLDhEQUFDQzt3QkFBS0MsTUFBSzt3QkFBV0MsU0FBUTs7Ozs7Ozs7Ozs7OzBCQUVoQyw4REFBQ1Qsb0RBQU9BO2dCQUNOVSxVQUFTO2dCQUNUQyxjQUFjO29CQUNaQyxXQUFXO29CQUNYQyxVQUFVO29CQUNWQyxPQUFPO3dCQUNMQyxZQUFZO3dCQUNaQyxPQUFPO3dCQUNQQyxjQUFjO29CQUNoQjtvQkFDQUMsU0FBUzt3QkFDUEMsV0FBVzs0QkFDVEMsU0FBUzs0QkFDVEMsV0FBVzt3QkFDYjtvQkFDRjtvQkFDQUMsT0FBTzt3QkFDTEgsV0FBVzs0QkFDVEMsU0FBUzs0QkFDVEMsV0FBVzt3QkFDYjtvQkFDRjtnQkFDRjs7Ozs7OzBCQUVGLDhEQUFDRTtnQkFBSVgsV0FBVTswQkFDYiw0RUFBQ1Q7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXNrLW1hbmFnZXItY2xpZW50Ly4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IHsgVG9hc3RlciB9IGZyb20gJ3JlYWN0LWhvdC10b2FzdCc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIC8vIEVuc3VyZSBzdG9yZSBpcyBzdGFibGUgYWNyb3NzIHJlbmRlcnNcbiAgY29uc3Qgc3RhYmxlU3RvcmUgPSB1c2VNZW1vKCgpID0+IHN0b3JlLCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8UHJvdmlkZXIgc3RvcmU9e3N0YWJsZVN0b3JlfT5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8dGl0bGU+VGFza01hc3RlciB8IEVudGVycHJpc2UgVGFzayBNYW5hZ2VtZW50PC90aXRsZT5cbiAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLCBtYXhpbXVtLXNjYWxlPTFcIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgPFRvYXN0ZXJcbiAgICAgICAgcG9zaXRpb249XCJib3R0b20tcmlnaHRcIlxuICAgICAgICB0b2FzdE9wdGlvbnM9e3tcbiAgICAgICAgICBjbGFzc05hbWU6ICd0ZXh0LXNtIGZvbnQtbWVkaXVtJyxcbiAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJyMzMzMnLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWNjZXNzOiB7XG4gICAgICAgICAgICBpY29uVGhlbWU6IHtcbiAgICAgICAgICAgICAgcHJpbWFyeTogJyM0ZjQ2ZTUnLFxuICAgICAgICAgICAgICBzZWNvbmRhcnk6ICcjZmZmJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgaWNvblRoZW1lOiB7XG4gICAgICAgICAgICAgIHByaW1hcnk6ICcjZWY0NDQ0JyxcbiAgICAgICAgICAgICAgc2Vjb25kYXJ5OiAnI2ZmZicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctYnJhbmQtNTAvNTAgdGV4dC1ncmF5LTkwMCBmb250LXNhbnMgYW50aWFsaWFzZWQgc2VsZWN0aW9uOmJnLWJyYW5kLTUwMCBzZWxlY3Rpb246dGV4dC13aGl0ZVwiPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1Byb3ZpZGVyPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlByb3ZpZGVyIiwic3RvcmUiLCJIZWFkIiwiVG9hc3RlciIsInVzZU1lbW8iLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzdGFibGVTdG9yZSIsInRpdGxlIiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwicG9zaXRpb24iLCJ0b2FzdE9wdGlvbnMiLCJjbGFzc05hbWUiLCJkdXJhdGlvbiIsInN0eWxlIiwiYmFja2dyb3VuZCIsImNvbG9yIiwiYm9yZGVyUmFkaXVzIiwic3VjY2VzcyIsImljb25UaGVtZSIsInByaW1hcnkiLCJzZWNvbmRhcnkiLCJlcnJvciIsImRpdiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./store/index.js":
/*!************************!*\
  !*** ./store/index.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   makeStore: () => (/* binding */ makeStore)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _slices_authSlice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slices/authSlice */ \"./store/slices/authSlice.js\");\n/* harmony import */ var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/api */ \"./store/services/api.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_services_api__WEBPACK_IMPORTED_MODULE_2__]);\n_services_api__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n// Create store factory function for Next.js SSR compatibility\nconst makeStore = ()=>{\n    return (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.configureStore)({\n        reducer: {\n            auth: _slices_authSlice__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n            [_services_api__WEBPACK_IMPORTED_MODULE_2__.api.reducerPath]: _services_api__WEBPACK_IMPORTED_MODULE_2__.api.reducer\n        },\n        middleware: (getDefault)=>getDefault().concat(_services_api__WEBPACK_IMPORTED_MODULE_2__.api.middleware)\n    });\n};\n// Create a singleton store for client-side\nlet store;\nif (false) {} else {\n    // For SSR, create a new store\n    store = makeStore();\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBa0Q7QUFDTDtBQUNSO0FBRXJDLDhEQUE4RDtBQUN2RCxNQUFNRyxZQUFZO0lBQ3ZCLE9BQU9ILGdFQUFjQSxDQUFDO1FBQ3BCSSxTQUFTO1lBQ1BDLE1BQU1KLHlEQUFXQTtZQUNqQixDQUFDQyw4Q0FBR0EsQ0FBQ0ksV0FBVyxDQUFDLEVBQUVKLDhDQUFHQSxDQUFDRSxPQUFPO1FBQ2hDO1FBQ0FHLFlBQVksQ0FBQ0MsYUFBZUEsYUFBYUMsTUFBTSxDQUFDUCw4Q0FBR0EsQ0FBQ0ssVUFBVTtJQUNoRTtBQUNGLEVBQUU7QUFFRiwyQ0FBMkM7QUFDM0MsSUFBSUc7QUFFSixJQUFJLEtBQWtCLEVBQWEsRUFFbEMsTUFBTTtJQUNMLDhCQUE4QjtJQUM5QkEsUUFBUVA7QUFDVjtBQUVBLGlFQUFlTyxLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGFzay1tYW5hZ2VyLWNsaWVudC8uL3N0b3JlL2luZGV4LmpzPzU2YTciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlndXJlU3RvcmUgfSBmcm9tIFwiQHJlZHV4anMvdG9vbGtpdFwiO1xuaW1wb3J0IGF1dGhSZWR1Y2VyIGZyb20gXCIuL3NsaWNlcy9hdXRoU2xpY2VcIjtcbmltcG9ydCB7IGFwaSB9IGZyb20gXCIuL3NlcnZpY2VzL2FwaVwiO1xuXG4vLyBDcmVhdGUgc3RvcmUgZmFjdG9yeSBmdW5jdGlvbiBmb3IgTmV4dC5qcyBTU1IgY29tcGF0aWJpbGl0eVxuZXhwb3J0IGNvbnN0IG1ha2VTdG9yZSA9ICgpID0+IHtcbiAgcmV0dXJuIGNvbmZpZ3VyZVN0b3JlKHtcbiAgICByZWR1Y2VyOiB7XG4gICAgICBhdXRoOiBhdXRoUmVkdWNlcixcbiAgICAgIFthcGkucmVkdWNlclBhdGhdOiBhcGkucmVkdWNlclxuICAgIH0sXG4gICAgbWlkZGxld2FyZTogKGdldERlZmF1bHQpID0+IGdldERlZmF1bHQoKS5jb25jYXQoYXBpLm1pZGRsZXdhcmUpXG4gIH0pO1xufTtcblxuLy8gQ3JlYXRlIGEgc2luZ2xldG9uIHN0b3JlIGZvciBjbGllbnQtc2lkZVxubGV0IHN0b3JlO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgc3RvcmUgPSBtYWtlU3RvcmUoKTtcbn0gZWxzZSB7XG4gIC8vIEZvciBTU1IsIGNyZWF0ZSBhIG5ldyBzdG9yZVxuICBzdG9yZSA9IG1ha2VTdG9yZSgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdG9yZTtcbiJdLCJuYW1lcyI6WyJjb25maWd1cmVTdG9yZSIsImF1dGhSZWR1Y2VyIiwiYXBpIiwibWFrZVN0b3JlIiwicmVkdWNlciIsImF1dGgiLCJyZWR1Y2VyUGF0aCIsIm1pZGRsZXdhcmUiLCJnZXREZWZhdWx0IiwiY29uY2F0Iiwic3RvcmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./store/index.js\n");

/***/ }),

/***/ "./store/services/api.js":
/*!*******************************!*\
  !*** ./store/services/api.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit/query/react */ \"@reduxjs/toolkit/query/react\");\n/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _slices_authSlice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../slices/authSlice */ \"./store/slices/authSlice.js\");\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-hot-toast */ \"react-hot-toast\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_hot_toast__WEBPACK_IMPORTED_MODULE_2__]);\nreact_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst baseQuery = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.fetchBaseQuery)({\n    baseUrl: \"http://localhost:4000/api/\",\n    prepareHeaders: (headers, { getState })=>{\n        const token = getState().auth.token;\n        if (token) {\n            headers.set(\"authorization\", `Bearer ${token}`);\n        }\n        return headers;\n    }\n});\n// Custom base query with error handling\nconst baseQueryWithErrorHandling = async (args, api, extraOptions)=>{\n    const result = await baseQuery(args, api, extraOptions);\n    // Handle errors\n    if (result.error) {\n        const status = result.error.status;\n        const message = result.error.data?.message || result.error.data?.error || \"An error occurred\";\n        // 401 Unauthorized - Token expired or invalid\n        if (status === 401) {\n            // Clear auth state\n            api.dispatch((0,_slices_authSlice__WEBPACK_IMPORTED_MODULE_1__.clearAuth)());\n            // Redirect to login (only if not already on login page)\n            if (false) {}\n        } else if (status === 403) {\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__[\"default\"].error(\"You don't have permission to perform this action\");\n        } else if (status === 404) {\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__[\"default\"].error(\"Resource not found\");\n        } else if (status === 500) {\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__[\"default\"].error(\"Server error. Please try again later.\");\n        } else if (status !== \"FETCH_ERROR\") {\n            // Don't show toast for network errors (user might be offline)\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__[\"default\"].error(message);\n        }\n    }\n    return result;\n};\nconst api = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({\n    reducerPath: \"api\",\n    baseQuery: baseQueryWithErrorHandling,\n    tagTypes: [\n        \"User\",\n        \"Project\",\n        \"Task\",\n        \"Organization\"\n    ],\n    endpoints: ()=>({})\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9zZXJ2aWNlcy9hcGkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBeUU7QUFDekI7QUFDWjtBQUVwQyxNQUFNSSxZQUFZSCw0RUFBY0EsQ0FBQztJQUMvQkksU0FBUztJQUNUQyxnQkFBZ0IsQ0FBQ0MsU0FBUyxFQUFFQyxRQUFRLEVBQUU7UUFDcEMsTUFBTUMsUUFBUUQsV0FBV0UsSUFBSSxDQUFDRCxLQUFLO1FBQ25DLElBQUlBLE9BQU87WUFDVEYsUUFBUUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRUYsTUFBTSxDQUFDO1FBQ2hEO1FBQ0EsT0FBT0Y7SUFDVDtBQUNGO0FBRUEsd0NBQXdDO0FBQ3hDLE1BQU1LLDZCQUE2QixPQUFPQyxNQUFNQyxLQUFLQztJQUNuRCxNQUFNQyxTQUFTLE1BQU1aLFVBQVVTLE1BQU1DLEtBQUtDO0lBRTFDLGdCQUFnQjtJQUNoQixJQUFJQyxPQUFPQyxLQUFLLEVBQUU7UUFDaEIsTUFBTUMsU0FBU0YsT0FBT0MsS0FBSyxDQUFDQyxNQUFNO1FBQ2xDLE1BQU1DLFVBQVVILE9BQU9DLEtBQUssQ0FBQ0csSUFBSSxFQUFFRCxXQUFXSCxPQUFPQyxLQUFLLENBQUNHLElBQUksRUFBRUgsU0FBUztRQUUxRSw4Q0FBOEM7UUFDOUMsSUFBSUMsV0FBVyxLQUFLO1lBQ2xCLG1CQUFtQjtZQUNuQkosSUFBSU8sUUFBUSxDQUFDbkIsNERBQVNBO1lBRXRCLHdEQUF3RDtZQUN4RCxJQUFJLEtBQW9FLEVBQVcsRUFLbEY7UUFDSCxPQUVLLElBQUlnQixXQUFXLEtBQUs7WUFDdkJmLDZEQUFXLENBQUM7UUFDZCxPQUVLLElBQUllLFdBQVcsS0FBSztZQUN2QmYsNkRBQVcsQ0FBQztRQUNkLE9BRUssSUFBSWUsV0FBVyxLQUFLO1lBQ3ZCZiw2REFBVyxDQUFDO1FBQ2QsT0FFSyxJQUFJZSxXQUFXLGVBQWU7WUFDakMsOERBQThEO1lBQzlEZiw2REFBVyxDQUFDZ0I7UUFDZDtJQUNGO0lBRUEsT0FBT0g7QUFDVDtBQUVPLE1BQU1GLE1BQU1kLHVFQUFTQSxDQUFDO0lBQzNCNEIsYUFBYTtJQUNieEIsV0FBV1E7SUFDWGlCLFVBQVU7UUFBQztRQUFRO1FBQVc7UUFBUTtLQUFlO0lBQ3JEQyxXQUFXLElBQU8sRUFBQztBQUNyQixHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGFzay1tYW5hZ2VyLWNsaWVudC8uL3N0b3JlL3NlcnZpY2VzL2FwaS5qcz82YmQyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUFwaSwgZmV0Y2hCYXNlUXVlcnkgfSBmcm9tICdAcmVkdXhqcy90b29sa2l0L3F1ZXJ5L3JlYWN0JztcclxuaW1wb3J0IHsgY2xlYXJBdXRoIH0gZnJvbSAnLi4vc2xpY2VzL2F1dGhTbGljZSc7XHJcbmltcG9ydCB0b2FzdCBmcm9tICdyZWFjdC1ob3QtdG9hc3QnO1xyXG5cclxuY29uc3QgYmFzZVF1ZXJ5ID0gZmV0Y2hCYXNlUXVlcnkoe1xyXG4gIGJhc2VVcmw6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpLycsXHJcbiAgcHJlcGFyZUhlYWRlcnM6IChoZWFkZXJzLCB7IGdldFN0YXRlIH0pID0+IHtcclxuICAgIGNvbnN0IHRva2VuID0gZ2V0U3RhdGUoKS5hdXRoLnRva2VuO1xyXG4gICAgaWYgKHRva2VuKSB7XHJcbiAgICAgIGhlYWRlcnMuc2V0KCdhdXRob3JpemF0aW9uJywgYEJlYXJlciAke3Rva2VufWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgfSxcclxufSk7XHJcblxyXG4vLyBDdXN0b20gYmFzZSBxdWVyeSB3aXRoIGVycm9yIGhhbmRsaW5nXHJcbmNvbnN0IGJhc2VRdWVyeVdpdGhFcnJvckhhbmRsaW5nID0gYXN5bmMgKGFyZ3MsIGFwaSwgZXh0cmFPcHRpb25zKSA9PiB7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYmFzZVF1ZXJ5KGFyZ3MsIGFwaSwgZXh0cmFPcHRpb25zKTtcclxuXHJcbiAgLy8gSGFuZGxlIGVycm9yc1xyXG4gIGlmIChyZXN1bHQuZXJyb3IpIHtcclxuICAgIGNvbnN0IHN0YXR1cyA9IHJlc3VsdC5lcnJvci5zdGF0dXM7XHJcbiAgICBjb25zdCBtZXNzYWdlID0gcmVzdWx0LmVycm9yLmRhdGE/Lm1lc3NhZ2UgfHwgcmVzdWx0LmVycm9yLmRhdGE/LmVycm9yIHx8ICdBbiBlcnJvciBvY2N1cnJlZCc7XHJcblxyXG4gICAgLy8gNDAxIFVuYXV0aG9yaXplZCAtIFRva2VuIGV4cGlyZWQgb3IgaW52YWxpZFxyXG4gICAgaWYgKHN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgIC8vIENsZWFyIGF1dGggc3RhdGVcclxuICAgICAgYXBpLmRpc3BhdGNoKGNsZWFyQXV0aCgpKTtcclxuXHJcbiAgICAgIC8vIFJlZGlyZWN0IHRvIGxvZ2luIChvbmx5IGlmIG5vdCBhbHJlYWR5IG9uIGxvZ2luIHBhZ2UpXHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAhd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4nKSkge1xyXG4gICAgICAgIHRvYXN0LmVycm9yKCdTZXNzaW9uIGV4cGlyZWQuIFBsZWFzZSBsb2dpbiBhZ2Fpbi4nKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9sb2dpbic7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIDQwMyBGb3JiaWRkZW4gLSBJbnN1ZmZpY2llbnQgcGVybWlzc2lvbnNcclxuICAgIGVsc2UgaWYgKHN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgIHRvYXN0LmVycm9yKCdZb3UgZG9uXFwndCBoYXZlIHBlcm1pc3Npb24gdG8gcGVyZm9ybSB0aGlzIGFjdGlvbicpO1xyXG4gICAgfVxyXG4gICAgLy8gNDA0IE5vdCBGb3VuZFxyXG4gICAgZWxzZSBpZiAoc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgdG9hc3QuZXJyb3IoJ1Jlc291cmNlIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG4gICAgLy8gNTAwIFNlcnZlciBFcnJvclxyXG4gICAgZWxzZSBpZiAoc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgdG9hc3QuZXJyb3IoJ1NlcnZlciBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICAgIH1cclxuICAgIC8vIE90aGVyIGVycm9yc1xyXG4gICAgZWxzZSBpZiAoc3RhdHVzICE9PSAnRkVUQ0hfRVJST1InKSB7XHJcbiAgICAgIC8vIERvbid0IHNob3cgdG9hc3QgZm9yIG5ldHdvcmsgZXJyb3JzICh1c2VyIG1pZ2h0IGJlIG9mZmxpbmUpXHJcbiAgICAgIHRvYXN0LmVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhcGkgPSBjcmVhdGVBcGkoe1xyXG4gIHJlZHVjZXJQYXRoOiAnYXBpJyxcclxuICBiYXNlUXVlcnk6IGJhc2VRdWVyeVdpdGhFcnJvckhhbmRsaW5nLFxyXG4gIHRhZ1R5cGVzOiBbJ1VzZXInLCAnUHJvamVjdCcsICdUYXNrJywgJ09yZ2FuaXphdGlvbiddLFxyXG4gIGVuZHBvaW50czogKCkgPT4gKHt9KSxcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVBcGkiLCJmZXRjaEJhc2VRdWVyeSIsImNsZWFyQXV0aCIsInRvYXN0IiwiYmFzZVF1ZXJ5IiwiYmFzZVVybCIsInByZXBhcmVIZWFkZXJzIiwiaGVhZGVycyIsImdldFN0YXRlIiwidG9rZW4iLCJhdXRoIiwic2V0IiwiYmFzZVF1ZXJ5V2l0aEVycm9ySGFuZGxpbmciLCJhcmdzIiwiYXBpIiwiZXh0cmFPcHRpb25zIiwicmVzdWx0IiwiZXJyb3IiLCJzdGF0dXMiLCJtZXNzYWdlIiwiZGF0YSIsImRpc3BhdGNoIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluY2x1ZGVzIiwic2V0VGltZW91dCIsImhyZWYiLCJyZWR1Y2VyUGF0aCIsInRhZ1R5cGVzIiwiZW5kcG9pbnRzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./store/services/api.js\n");

/***/ }),

/***/ "./store/slices/authSlice.js":
/*!***********************************!*\
  !*** ./store/slices/authSlice.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearAuth: () => (/* binding */ clearAuth),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   setAuth: () => (/* binding */ setAuth)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"@reduxjs/toolkit\");\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);\n\nconst initialState = {\n    user: null,\n    token: null,\n    organizations: []\n};\nconst slice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"auth\",\n    initialState,\n    reducers: {\n        setAuth (state, action) {\n            state.user = action.payload.user;\n            state.token = action.payload.accessToken || action.payload.token;\n            state.organizations = action.payload.organizations || state.organizations || [];\n        },\n        clearAuth (state) {\n            state.user = null;\n            state.token = null;\n            state.organizations = [];\n        }\n    }\n});\nconst { setAuth, clearAuth } = slice.actions;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slice.reducer);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9yZS9zbGljZXMvYXV0aFNsaWNlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQStDO0FBRS9DLE1BQU1DLGVBQWU7SUFBRUMsTUFBTTtJQUFNQyxPQUFPO0lBQU1DLGVBQWUsRUFBRTtBQUFDO0FBRWxFLE1BQU1DLFFBQVFMLDZEQUFXQSxDQUFDO0lBQ3hCTSxNQUFNO0lBQ05MO0lBQ0FNLFVBQVU7UUFDUkMsU0FBUUMsS0FBSyxFQUFFQyxNQUFNO1lBQ25CRCxNQUFNUCxJQUFJLEdBQUdRLE9BQU9DLE9BQU8sQ0FBQ1QsSUFBSTtZQUNoQ08sTUFBTU4sS0FBSyxHQUFHTyxPQUFPQyxPQUFPLENBQUNDLFdBQVcsSUFBSUYsT0FBT0MsT0FBTyxDQUFDUixLQUFLO1lBQ2hFTSxNQUFNTCxhQUFhLEdBQUdNLE9BQU9DLE9BQU8sQ0FBQ1AsYUFBYSxJQUFJSyxNQUFNTCxhQUFhLElBQUksRUFBRTtRQUNqRjtRQUNBUyxXQUFVSixLQUFLO1lBQ2JBLE1BQU1QLElBQUksR0FBRztZQUNiTyxNQUFNTixLQUFLLEdBQUc7WUFDZE0sTUFBTUwsYUFBYSxHQUFHLEVBQUU7UUFDMUI7SUFDRjtBQUNGO0FBRU8sTUFBTSxFQUFFSSxPQUFPLEVBQUVLLFNBQVMsRUFBRSxHQUFHUixNQUFNUyxPQUFPLENBQUM7QUFDcEQsaUVBQWVULE1BQU1VLE9BQU8sRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Rhc2stbWFuYWdlci1jbGllbnQvLi9zdG9yZS9zbGljZXMvYXV0aFNsaWNlLmpzP2I5ZGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2xpY2UgfSBmcm9tIFwiQHJlZHV4anMvdG9vbGtpdFwiO1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7IHVzZXI6IG51bGwsIHRva2VuOiBudWxsLCBvcmdhbml6YXRpb25zOiBbXSB9O1xuXG5jb25zdCBzbGljZSA9IGNyZWF0ZVNsaWNlKHtcbiAgbmFtZTogXCJhdXRoXCIsXG4gIGluaXRpYWxTdGF0ZSxcbiAgcmVkdWNlcnM6IHtcbiAgICBzZXRBdXRoKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgIHN0YXRlLnVzZXIgPSBhY3Rpb24ucGF5bG9hZC51c2VyO1xuICAgICAgc3RhdGUudG9rZW4gPSBhY3Rpb24ucGF5bG9hZC5hY2Nlc3NUb2tlbiB8fCBhY3Rpb24ucGF5bG9hZC50b2tlbjtcbiAgICAgIHN0YXRlLm9yZ2FuaXphdGlvbnMgPSBhY3Rpb24ucGF5bG9hZC5vcmdhbml6YXRpb25zIHx8IHN0YXRlLm9yZ2FuaXphdGlvbnMgfHwgW107XG4gICAgfSxcbiAgICBjbGVhckF1dGgoc3RhdGUpIHtcbiAgICAgIHN0YXRlLnVzZXIgPSBudWxsO1xuICAgICAgc3RhdGUudG9rZW4gPSBudWxsO1xuICAgICAgc3RhdGUub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgIH1cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCB7IHNldEF1dGgsIGNsZWFyQXV0aCB9ID0gc2xpY2UuYWN0aW9ucztcbmV4cG9ydCBkZWZhdWx0IHNsaWNlLnJlZHVjZXI7XG4iXSwibmFtZXMiOlsiY3JlYXRlU2xpY2UiLCJpbml0aWFsU3RhdGUiLCJ1c2VyIiwidG9rZW4iLCJvcmdhbml6YXRpb25zIiwic2xpY2UiLCJuYW1lIiwicmVkdWNlcnMiLCJzZXRBdXRoIiwic3RhdGUiLCJhY3Rpb24iLCJwYXlsb2FkIiwiYWNjZXNzVG9rZW4iLCJjbGVhckF1dGgiLCJhY3Rpb25zIiwicmVkdWNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./store/slices/authSlice.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@reduxjs/toolkit":
/*!***********************************!*\
  !*** external "@reduxjs/toolkit" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@reduxjs/toolkit");

/***/ }),

/***/ "@reduxjs/toolkit/query/react":
/*!***********************************************!*\
  !*** external "@reduxjs/toolkit/query/react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@reduxjs/toolkit/query/react");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-redux");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react-hot-toast":
/*!**********************************!*\
  !*** external "react-hot-toast" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-hot-toast");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();