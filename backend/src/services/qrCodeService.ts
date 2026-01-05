import QRCode from 'qrcode';

export class QRCodeService {
  async generateQRCode(gameCode: string, baseUrl: string): Promise<string> {
    const url = `${baseUrl}/play?code=${gameCode}`;

    try {
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  async generateQRCodeBuffer(gameCode: string, baseUrl: string): Promise<Buffer> {
    const url = `${baseUrl}/play?code=${gameCode}`;

    try {
      const buffer = await QRCode.toBuffer(url, {
        width: 400,
        margin: 2,
      });

      return buffer;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }
}

export default new QRCodeService();
