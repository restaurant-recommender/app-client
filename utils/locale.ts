import { useIntl } from "react-intl"

export const useFormatter = () => {
    const { formatMessage } = useIntl()
    return id => formatMessage({ id })
}