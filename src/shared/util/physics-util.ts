/**
 * Adds the specified object and its descendants to the given collision group.
 * Only objects of type BasePart will be added to the collision group.
 *
 * @param object - The instance to add to the collision group.
 * @param group - The collision group to add the object to.
 */
export function addToCollisionGroup(object: Instance, group: string): void {
	if (object.IsA("BasePart")) {
		object.CollisionGroup = group;
	}

	for (const descendant of object.GetDescendants()) {
		if (descendant.IsA("BasePart")) {
			descendant.CollisionGroup = group;
		}
	}
}
