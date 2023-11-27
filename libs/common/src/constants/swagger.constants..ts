import { SwaggerCustomOptions } from '@nestjs/swagger';

export const SWAGGER_CUSTOM_OPTIONS: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss:
    '.swagger-ui .opblock .opblock-summary .view-line-link.copy-to-clipboard{display:flex; width:24px; margin: 0px 5px;}',
} as const;
