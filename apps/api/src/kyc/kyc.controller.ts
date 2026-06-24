import { Controller, Post, Get, UseGuards, Req, UploadedFiles, UseInterceptors, Body } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { KycService } from './kyc.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

type UploadedFile = { path?: string; filename?: string; originalname?: string }

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private service: KycService) {}

  @Get('status')
  getStatus(@Req() req: any) {
    return this.service.getStatus(req.user.id)
  }

  @Post('submit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]))
  async submit(
    @Req() req: any,
    @Body('docType') docType: string,
    @UploadedFiles() files: { front?: UploadedFile[]; back?: UploadedFile[]; selfie?: UploadedFile[] },
  ) {
    const frontUrl = files.front?.[0]?.path || files.front?.[0]?.filename || ''
    const backUrl = files.back?.[0]?.path
    const selfieUrl = files.selfie?.[0]?.path || files.selfie?.[0]?.filename || ''
    return this.service.submitDocuments(req.user.id, docType, { front: frontUrl, back: backUrl, selfie: selfieUrl })
  }
}
