import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDescription } from '@/components/ui/alert';

type Props = { isOpened: boolean; onCancel: () => void; onConfirm: () => void };
const SettingsFormAlertDialog = ({ isOpened, onCancel, onConfirm }: Props) => {
	return (
		<AlertDialog open={isOpened}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDescription>
						Changing a Shared workspace to a Private workspace will remove all
						collaborators permanantly.
					</AlertDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default SettingsFormAlertDialog;
