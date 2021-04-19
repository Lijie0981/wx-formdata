import { lookup } from "mime-types";
import parsePath from "parse-filepath";

declare global {
	interface String {
		utf8CodeAt: (i: number) => number[];
	}
}

export function randomString(length: number = 17) {
	let res = "";
	for (let i = 0; i < length; i++) {
		let n = parseInt(Math.random() * 62 + "", 10);
		if (n <= 9) {
			res += n;
		} else if (n <= 35) {
			res += String.fromCharCode(n + 55);
		} else {
			res += String.fromCharCode(n + 61);
		}
	}
	return res;
}

export function formDataArray(
	boundary: string,
	name: string,
	value: any,
	fileName?: string
): number[] {
	let dataString = "";
	let isFile = !!fileName;

	dataString += boundary + "\r\n";
	dataString += 'Content-Disposition: form-data; name="' + name + '"';

	if (isFile) {
		dataString += '; filename="' + fileName + '"' + "\r\n";
		dataString += "Content-Type: " + lookup(fileName!) + "\r\n\r\n";
	} else {
		dataString += "\r\n\r\n";
		dataString += value;
	}

	var dataArray = [];
	for (var i = 0; i < dataString.length; i++) {
		// 取出文本的charCode（10进制）
		dataArray.push(...dataString.utf8CodeAt(i));
	}

	if (isFile) {
		let fileArray = new Uint8Array(value);
		dataArray = dataArray.concat(Array.prototype.slice.call(fileArray));
	}
	dataArray.push(..."\r".utf8CodeAt(0));
	dataArray.push(..."\n".utf8CodeAt(0));

	return dataArray;
}

String.prototype.utf8CodeAt = function (i: number): number[] {
	const out = [];
	let p = 0;
	let c = this.charCodeAt(i);
	if (c < 128) {
		out[p++] = c;
	} else if (c < 2048) {
		out[p++] = (c >> 6) | 192;
		out[p++] = (c & 63) | 128;
	} else if (
		(c & 0xfc00) === 0xd800 &&
		i + 1 < this.length &&
		(this.charCodeAt(i + 1) & 0xfc00) === 0xdc00
	) {
		// Surrogate Pair
		c = 0x10000 + ((c & 0x03ff) << 10) + (this.charCodeAt(++i) & 0x03ff);
		out[p++] = (c >> 18) | 240;
		out[p++] = ((c >> 12) & 63) | 128;
		out[p++] = ((c >> 6) & 63) | 128;
		out[p++] = (c & 63) | 128;
	} else {
		out[p++] = (c >> 12) | 224;
		out[p++] = ((c >> 6) & 63) | 128;
		out[p++] = (c & 63) | 128;
	}
	return out;
};

type File = {
	buffer: ArrayBuffer;
	path: string;
};

type Data = {
	[key: string]: string | File;
};

class FormData {
	fileManager = wx.getFileSystemManager();
	data: Data = {};
	static boundary = "----wxmpFormBoundary";

	isBuffer(buffer: any) {
		if (Object.prototype.toString.call(buffer).indexOf("ArrayBuffer") < 0) {
			throw new Error("File cannot convert to buffer");
		}
	}
	append(name: string, value: string | ArrayBuffer, path?: string) {
		if (!path) {
			this.data[name] = value as string;
			return;
		}

		let buffer = value ? value : this.fileManager.readFileSync(path);

		this.isBuffer(buffer);

		this.data[name] = {
			buffer: buffer as ArrayBuffer,
			path: parsePath(path).basename,
		};
	}

	get(name: string): string | File {
		return this.data[name];
	}

	delete(name: string) {
		delete this.data[name];
	}

	has(name: string) {
		return this.data[name] !== undefined;
	}

	appendFile(name: string, path: string) {
		let buffer = this.fileManager.readFileSync(path);
		this.isBuffer(buffer);
		this.append(name, buffer, path);
	}

	getData() {
		return this.convert(this.data);
	}

	convert(data: Data) {
		let boundaryKey = FormData.boundary + randomString(); // 数据分割符，一般是随机的字符串
		let prefix = "--";
		let boundary = prefix + boundaryKey;
		let endBoundary = boundary + prefix;

		let postArray: any[] = [];

		//拼接参数
		if (data && Object.prototype.toString.call(data) == "[object Object]") {
			for (let key in data) {
				if ((data[key] as File).path) {
					postArray = postArray.concat(
						formDataArray(boundary, key, data[key], (data[key] as File).path)
					);
				} else {
					postArray = postArray.concat(formDataArray(boundary, key, data[key]));
				}
			}
		}

		//结尾
		let endBoundaryArray = [];
		for (var i = 0; i < endBoundary.length; i++) {
			// 最后取出结束boundary的charCode
			endBoundaryArray.push(...endBoundary.utf8CodeAt(i));
		}

		postArray = postArray.concat(endBoundaryArray);

		return {
			contentType: "multipart/form-data; boundary=" + boundaryKey,
			buffer: new Uint8Array(postArray).buffer,
		};
	}
}

export default FormData;
