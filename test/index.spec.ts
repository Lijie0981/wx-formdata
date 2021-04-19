import FormData, { randomString, formDataArray } from "../src/index";

const wx = {};
describe("form-data", () => {
	const formData = new FormData();
	test("append normal ", () => {
		formData.append("name", "name");
		expect(formData.get('name')).toEqual('name');
	});
	test("append file ", () => {
		const buffer = new ArrayBuffer(16);
		const result = {
			buffer,
			path: 'b.js'
		};
		formData.append("name123", new ArrayBuffer(16), "./a/b/b.js");
		expect(formData.get('name123')).toEqual(result);

	});
	test("has", () => {
		expect(formData.has("name")).toBeTruthy();
	});
	test("delete", () => {
		formData.delete("name");
		expect(formData.has("name")).toBeFalsy();
	});
	test("getData", () => {
		const {
			contentType,
			buffer
		} = formData.getData();
		expect(contentType).toContain('multipart/form-data; boundary=' + FormData.boundary);
		expect(buffer.byteLength).toBeTruthy();
	});
});

describe("utils", () => {
	const boundary = "as1123";

	test("randomString", () => {
		const result = 17;
		expect(randomString().length).toEqual(result);
	});

	test("formDataArray string", () => {
		const result = [
			97,
			115,
			49,
			49,
			50,
			51,
			13,
			10,
			67,
			111,
			110,
			116,
			101,
			110,
			116,
			45,
			68,
			105,
			115,
			112,
			111,
			115,
			105,
			116,
			105,
			111,
			110,
			58,
			32,
			102,
			111,
			114,
			109,
			45,
			100,
			97,
			116,
			97,
			59,
			32,
			110,
			97,
			109,
			101,
			61,
			34,
			110,
			97,
			109,
			101,
			34,
			13,
			10,
			13,
			10,
			118,
			97,
			108,
			117,
			101,
			13,
			10,
		];
		expect(formDataArray(boundary, "name", "value")).toEqual(result);
	});

	test("formDataArray file", () => {
		const result = [
			97,
			115,
			49,
			49,
			50,
			51,
			13,
			10,
			67,
			111,
			110,
			116,
			101,
			110,
			116,
			45,
			68,
			105,
			115,
			112,
			111,
			115,
			105,
			116,
			105,
			111,
			110,
			58,
			32,
			102,
			111,
			114,
			109,
			45,
			100,
			97,
			116,
			97,
			59,
			32,
			110,
			97,
			109,
			101,
			61,
			34,
			110,
			97,
			109,
			101,
			34,
			59,
			32,
			102,
			105,
			108,
			101,
			110,
			97,
			109,
			101,
			61,
			34,
			47,
			97,
			47,
			98,
			47,
			97,
			46,
			106,
			101,
			115,
			116,
			46,
			116,
			115,
			34,
			13,
			10,
			67,
			111,
			110,
			116,
			101,
			110,
			116,
			45,
			84,
			121,
			112,
			101,
			58,
			32,
			118,
			105,
			100,
			101,
			111,
			47,
			109,
			112,
			50,
			116,
			13,
			10,
			13,
			10,
			13,
			10,
		];
		expect(formDataArray(boundary, "name", "value", "/a/b/a.jest.ts")).toEqual(
			result
		);
	});
});
