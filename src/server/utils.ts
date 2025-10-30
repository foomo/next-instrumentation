export const getEnvBoolean = (name: string): boolean => {
	const v: string | undefined = process?.env?.[name]
	switch (`${v}`.toLowerCase()) {
		case 'true':
			return true
		case '1':
			return true
	}
	return false
}

export const getEnvNumber = (name: string): number => {
	const v: string | undefined = process?.env?.[name]
	if (v === undefined) {
		return 1
	}
	return Number.parseFloat(v)
}
