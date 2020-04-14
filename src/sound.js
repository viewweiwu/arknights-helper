import { Howl } from 'howler'
import back from '@/assets/audio/g_ui_back.wav'
import click from '@/assets/audio/g_ui_btn_n.wav'
import stagepull from '@/assets/audio/g_ui_stagepull.wav'
import confirm from '@/assets/audio/g_ui_confirm.wav'
import popup from '@/assets/audio/g_ui_popup.wav'
import tab from '@/assets/audio/g_ui_tabswitch.wav'

export default {
  back: new Howl({ src: [back] }),
  click: new Howl({ src: [click] }),
  stagepull: new Howl({ src: [stagepull] }),
  confirm: new Howl({ src: [confirm] }),
  popup: new Howl({ src: [popup] }),
  tab: new Howl({ src: [tab] })
}
