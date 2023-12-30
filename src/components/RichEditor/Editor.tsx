import type { Quill } from 'quill';
import { useCallback } from 'react';

const TOOLBAR_OPTIONS = [
	['bold', 'italic', 'underline', 'strike'], // toggled buttons
	['blockquote', 'code-block'],

	[{ header: 1 }, { header: 2 }], // custom button values
	[{ list: 'ordered' }, { list: 'bullet' }],
	[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
	[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
	[{ direction: 'rtl' }], // text direction

	[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
	[{ header: [1, 2, 3, 4, 5, 6, false] }],

	[{ color: [] }, { background: [] }], // dropdown with defaults from theme
	[{ font: [] }],
	[{ align: [] }],

	['clean'], // remove formatting button
];

type Props = {
	setQuillIns: (quill: Quill) => void;
};
const Editor = ({ setQuillIns }: Props) => {
	const wrapperRef = useCallback(
		async (wrapper: any) => {
			if (typeof window !== 'undefined') {
				if (wrapper === null) return;
				wrapper.innerHTML = '';
				const editor = document.createElement('div');
				wrapper.append(editor);
				const Quill = (await import('quill')).default;
				// const QuillCursors = (await import('quill-cursors')).default;
				// Quill.register('modules/cursors', QuillCursors);
				setQuillIns(
					new Quill(editor, {
						theme: 'snow',
						modules: {
							toolbar: TOOLBAR_OPTIONS,
							// cursors: {
							// 	transformOnTextChange: true,
							// },
						},
					}),
				);
			}
		},
		[setQuillIns],
	);

	return (
		<div id='container' className='max-w-[800px] mx-auto' ref={wrapperRef} />
	);
};

export default Editor;
