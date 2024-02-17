import axios from "axios";

export const telegraph = async (buffer) => {
	if (!Buffer.isBuffer(buffer)) {
		throw new Error("Buffer is not a buffer");
	}
	const form = new FormData();
	const blob = new Blob([buffer], { type: "image/jpeg" });
	form.append("file", blob, "file");
	const { data } = await axios.post("https://telegra.ph/upload", form, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return "https://telegra.ph" + data[0].src;
};
