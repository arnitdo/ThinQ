import {Tldraw, track, useEditor} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import {useYjsStore} from '../util/client/hooks/useYjsStore'

const HOST_URL = 'wss://droplet.arnitdo.dev/tldraw'

export default function Draw({room}) {
	const store = useYjsStore({
		roomId:  room,
		hostUrl: HOST_URL,
	})

	return (
		<div className="tldraw__editor h-full w-full">
			<Tldraw
				autoFocus
				store={store}
				components={{
					SharePanel: NameEditor,
				}}
			/>
		</div>
	)
}

const NameEditor = track(() => {
	const editor = useEditor()

	const { color, name } = editor.user.getUserPreferences()

	return (
		<div style={{ pointerEvents: 'all', display: 'flex' }}>
			<input
				type="color"
				value={color}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						color: e.currentTarget.value,
					})
				}}
			/>
			<input
				value={name}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						name: e.currentTarget.value,
					})
				}}
			/>
		</div>
	)
})