import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Signimus',

  projectId: '01jt7o8j',
  dataset: 'zenith',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
