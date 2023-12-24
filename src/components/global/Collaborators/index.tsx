'use client';
import CollaboratorsList from './List';
import CollaboratorsSearch from './Search';
import useCollaborators from './use-collaborators';

const Collaborators = () => {
	const {
		store: { collaborators, existsCollaboratorIdsSet },
		action: { addCollaborator, deleteCollaborator },
	} = useCollaborators();

	return (
		<div>
			<CollaboratorsSearch
				existsCollaboratorIdsSet={existsCollaboratorIdsSet}
				addCollaborator={addCollaborator}
			/>
			<CollaboratorsList
				collaborators={collaborators}
				deleteCollaborator={deleteCollaborator}
			/>
		</div>
	);
};
export default Collaborators;
