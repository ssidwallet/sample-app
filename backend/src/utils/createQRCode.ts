import qrcode from "qrcode";

export default async function createQRCode(data: any): Promise<string> {
  return await qrcode.toDataURL(JSON.stringify(data));
}
