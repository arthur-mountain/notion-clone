'use client';
import type { AppStoreFolderType } from '@/components/Providers/AppProvider/use-init';
import { FileIcon, FolderIcon } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/components/Providers/AppProvider';

const TrashRestore = () => {
	const {
		store: { workspaces, workspaceId },
	} = useAppStore();
	const currentWorkspace = workspaces.find(
		(workspace) => workspace.id === workspaceId,
	);

	if (!currentWorkspace) return null;

	const { folders, files, isEmpty } = (() => {
		let folders: AppStoreFolderType[] = [];
		let files: AppStoreFolderType['files'] = [];
		currentWorkspace.folders?.forEach((folder) => {
			if (folder.inTrash) folders.push(folder);
			folder.files?.forEach((file) => {
				if (file.inTrash) files.push(file);
			});
		});
		return { folders, files, isEmpty: !folders.length && !files.length };
	})();

	return (
		<section>
			{!!folders.length && (
				<>
					<h3>Folders</h3>
					<ul className='m-0 p-0 list-none mb-4'>
						{folders.map((folder) => (
							<li key={folder.id}>
								<Link
									href={`/dashboard/${folder.workspaceId}/${folder.id}`}
									className='hover:bg-muted rounded-md p-2 flex item-center gap-2'
								>
									<FolderIcon />
									{folder.title}
								</Link>
							</li>
						))}
					</ul>
				</>
			)}
			{!!files.length && (
				<>
					<h3>Files</h3>
					<ul className='m-0 p-0 list-none'>
						{files.map((file) => (
							<li key={file.id}>
								<Link
									href={`/dashboard/${file.workspaceId}/${file.folderId}/${file.id}`}
									className=' hover:bg-muted rounded-md p-2 flex items-center gap-2'
								>
									<FileIcon />
									{file.title}
								</Link>
							</li>
						))}
					</ul>
				</>
			)}
			{isEmpty && (
				<div className='text-muted-foreground absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2'>
					No Items in trash
				</div>
			)}
		</section>
	);
};

export default TrashRestore;
