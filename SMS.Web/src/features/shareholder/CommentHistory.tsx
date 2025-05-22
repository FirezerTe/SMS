import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { ChangeEvent, Fragment, useCallback, useState } from "react";
import {
  ShareholderComment,
  useAddShareholderNoteMutation,
} from "../../app/api";
import { FormattedText } from "../../components";
import { useAlert } from "../notification";

export const CommentHistory = ({
  shareholderId,
  comments,
}: {
  shareholderId: number;
  comments: ShareholderComment[] | null | undefined;
}) => {
  const [comment, setComment] = useState("");
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const [addShareholderNote] = useAddShareholderNoteMutation();

  const onCommentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setComment(event.target.value || "");
    },
    []
  );

  const onSave = useCallback(() => {
    const _comment = comment?.trim();
    if (!_comment) {
      return;
    }
    addShareholderNote({
      id: shareholderId,
      note: {
        text: _comment,
      },
    })
      .unwrap()
      .then(() => {
        showSuccessAlert("Comment submitted");
        setComment("");
      })
      .catch(() => {
        showErrorAlert("Error occurred");
      });
  }, [
    addShareholderNote,
    comment,
    shareholderId,
    showErrorAlert,
    showSuccessAlert,
  ]);

  return (
    <Box sx={{ maxWidth: 800, p: 1 }}>
      <Paper elevation={0}>
        <Box>
          <TextField
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            required
            value={comment}
            onChange={onCommentChange}
            placeholder="Add note"
          />
        </Box>
      </Paper>
      <Box sx={{ display: "flex", mb: 2, pt: 0.5 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveIcon fontSize="inherit" />}
          onClick={onSave}
          disabled={!comment?.trim()}
        >
          Save Note
        </Button>
      </Box>
      <Box>
        {!!comments?.length && (
          <List sx={{ width: "500" }}>
            {comments.map(({ commentedBy, commentType, text, date }, index) => (
              <Fragment key={date}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      {`${(commentedBy || "").split(" ")[0][0]}${
                        (commentedBy || "").split(" ")[1][0]
                      }`}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ variant: "subtitle2" }}
                    primary={
                      <Box sx={{ display: "flex", gap: 1, py: 0.1 }}>
                        <Typography variant="subtitle2">
                          {commentedBy}
                        </Typography>
                        {!!(commentType && commentType !== "Note") && (
                          <Typography variant="body2" fontStyle={"italic"}>
                            ({commentType} comment)
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Box component="span" sx={{ mb: 1, display: "block" }}>
                          {`${dayjs(date).format("dddd, MMMM D, YYYY h:mm A")}`}
                        </Box>
                        <FormattedText text={text} />
                      </>
                    }
                  />
                </ListItem>
                {index < comments.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
